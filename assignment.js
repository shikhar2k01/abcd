const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;
global.Node = new JSDOM().window.Node;

async function fetchAndPreprocess(url, outputFilePath) {
  try {
    const response = await fetch(url);
    const htmlString = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const preprocessedData = preprocessDOM(doc);

    saveToFile(outputFilePath, JSON.stringify(preprocessedData, null, 2));

    console.log('Preprocessed data saved to:', outputFilePath);
  } catch (error) {
    console.error('Error fetching or processing the content:', error);
  }
}

function preprocessDOM(doc) {
  const result = {};

  // Extract metadata
  result.title = doc.title;
  result.keywords = getMetaContent(doc, 'keywords');
  result.description = getMetaContent(doc, 'description');
  result.author = getMetaContent(doc, 'author');
  result.charset = getCharset(doc);

  // Extract text content from specific elements
  result.bodyText = extractSentencesFromElement(doc.body);

  // Remove uninteresting attributes and specific elements
  removeUninterestingAttributes(doc);

  return result;
}

function extractSentencesFromElement(element) {
  const sentences = [];

  element.childNodes.forEach((node) => {
    if (node.nodeType === global.Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      if (tagName.startsWith('h') || tagName === 'p') {
        const sentence = node.textContent.trim();
        if (sentence) {
          sentences.push(sentence);
        }
      } else if (node.textContent.trim() !== '') {
        const sentence = node.textContent.trim();
        if (sentence) {
          sentences.push(sentence);
        }
      }
    }
  });

  const bodyText = sentences.join(' ').replace(/\s+/g, ' ');

  return bodyText;
}

function removeUninterestingAttributes(doc) {
  doc.querySelectorAll('*').forEach((element) => {
    const uninterestingAttributes = ['class', 'id', 'style'];
    const ignoredElements = ['input', 'textarea'];

    if (ignoredElements.includes(element.tagName.toLowerCase())) {
      element.remove();
    } else {
      uninterestingAttributes.forEach((attr) => {
        element.removeAttribute(attr);
      });
    }
  });
}

function getMetaContent(doc, name) {
  const metaElement = doc.querySelector(`meta[name="${name}"]`);
  return metaElement ? metaElement.getAttribute('content') : null;
}

function getCharset(doc) {
  const charsetMeta = doc.querySelector('meta[charset]');
  return charsetMeta ? charsetMeta.getAttribute('charset') : null;
}

function saveToFile(filePath, data) {
  fs.writeFileSync(filePath, data);
}

const url = 'https://github.com/kaavee315';
const outputFilePath = 'output.json';
fetchAndPreprocess(url, outputFilePath);
