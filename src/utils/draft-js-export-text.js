import {
  getEntityRanges,
  BLOCK_TYPE,
  ENTITY_TYPE,
} from 'draft-js-utils';
import { shortenUrls } from './shortener';

const CODE_INDENT = '    ';

function canHaveDepth(blockType) {
  switch (blockType) {
    case BLOCK_TYPE.UNORDERED_LIST_ITEM:
    case BLOCK_TYPE.ORDERED_LIST_ITEM:
      return true;
    default:
      return false;
  }
}

function encodeContent(text) {
  return text.replace(/[*_`]/g, '\\$&');
}

// Encode chars that would normally be allowed in a URL but would conflict with
// our markdown syntax: `[foo](http://foo/)`
function encodeURL(url) {
  return url.replace(/\)/g, '%29');
}

class MarkupGenerator {
  constructor(contentState) {
    this.contentState = contentState;
  }

  async generate() {
    this.urls = [];
    this.output = [];
    this.blocks = this.contentState.getBlockMap().toArray();
    this.totalBlocks = this.blocks.length;
    this.currentBlock = 0;
    this.listItemCounts = {};
    while (this.currentBlock < this.totalBlocks) {
      this.processBlock();
    }
    return shortenUrls(this.urls, this.output.join(''));
  }

  processBlock() {
    const block = this.blocks[this.currentBlock];
    const blockType = block.getType();
    switch (blockType) {
      case BLOCK_TYPE.UNORDERED_LIST_ITEM: {
        const blockDepth = block.getDepth();
        const lastBlock = this.getLastBlock();
        const lastBlockType = lastBlock ? lastBlock.getType() : null;
        const lastBlockDepth = lastBlock && canHaveDepth(lastBlockType)
          ? lastBlock.getDepth()
          : null;
        if (lastBlockType !== blockType && lastBlockDepth !== blockDepth - 1) {
          this.insertLineBreak();
          // Insert an additional line break if following opposite list type.
          if (lastBlockType === BLOCK_TYPE.ORDERED_LIST_ITEM) {
            this.insertLineBreak();
          }
        }
        const indent = ' '.repeat(block.depth * 4);
        this.output.push(`${indent}- ${this.renderBlockContent(block)}\n`);
        break;
      }
      case BLOCK_TYPE.ORDERED_LIST_ITEM: {
        const blockDepth = block.getDepth();
        const lastBlock = this.getLastBlock();
        const lastBlockType = lastBlock ? lastBlock.getType() : null;
        const lastBlockDepth = lastBlock && canHaveDepth(lastBlockType)
          ? lastBlock.getDepth()
          : null;
        if (lastBlockType !== blockType && lastBlockDepth !== blockDepth - 1) {
          this.insertLineBreak();
          // Insert an additional line break if following opposite list type.
          if (lastBlockType === BLOCK_TYPE.UNORDERED_LIST_ITEM) {
            this.insertLineBreak();
          }
        }
        const indent = ' '.repeat(blockDepth * 4);
        // TODO: figure out what to do with two-digit numbers
        const count = this.getListItemCount(block) % 10;
        this.output.push(`${indent}${count}. ${this.renderBlockContent(block)}\n`);
        break;
      }
      case BLOCK_TYPE.BLOCKQUOTE: {
        this.insertLineBreak();
        this.output.push(` > ${this.renderBlockContent(block)}\n`);
        break;
      }
      case BLOCK_TYPE.CODE: {
        this.insertLineBreak();
        this.output.push(`${CODE_INDENT}${this.renderBlockContent(block)}\n`);
        break;
      }
      default: {
        this.insertLineBreak();
        this.output.push(`${this.renderBlockContent(block)}\n`);
        break;
      }
    }
    this.currentBlock += 1;
  }

  getLastBlock() {
    return this.blocks[this.currentBlock - 1];
  }

  getNextBlock() {
    return this.blocks[this.currentBlock + 1];
  }

  getListItemCount(block) {
    const blockType = block.getType();
    const blockDepth = block.getDepth();
    // To decide if we need to start over we need to backtrack (skipping list
    // items that are of greater depth)
    let index = this.currentBlock - 1;
    let prevBlock = this.blocks[index];
    while (prevBlock && canHaveDepth(prevBlock.getType()) && prevBlock.getDepth() > blockDepth) {
      index -= 1;
      prevBlock = this.blocks[index];
    }
    if (!prevBlock || prevBlock.getType() !== blockType || prevBlock.getDepth() !== blockDepth) {
      this.listItemCounts[blockDepth] = 0;
    }
    this.listItemCounts[blockDepth] = this.listItemCounts[blockDepth] + 1;
    return this.listItemCounts[blockDepth];
  }

  insertLineBreak() {
    if (this.currentBlock > 0) {
      this.output.push('\n');
    }
  }

  renderBlockContent(block) {
    const { contentState } = this;
    const blockType = block.getType(); // eslint-disable-line no-unused-vars
    const text = block.getText();
    if (text === '') {
      // Prevent element collapse if completely empty.
      // TODO: Replace with constant.
      return '\u200B';
    }
    const charMetaList = block.getCharacterList();
    const entityPieces = getEntityRanges(text, charMetaList);
    return entityPieces
      .map(([entityKey, stylePieces]) => {
        const content = stylePieces
          .map(([text2, style]) => { // eslint-disable-line no-unused-vars
            // Don't allow empty inline elements.
            if (!text2) {
              return '';
            }
            return encodeContent(text2);
          })
          .join('');
        const entity = entityKey ? contentState.getEntity(entityKey) : null;
        if (entity != null && entity.getType() === ENTITY_TYPE.LINK) {
          const data = entity.getData();
          const url = (data.url && encodeURL(data.url)) || '';
          this.urls.push(url);
          return `${content.trim()} [${url}] `;
        }
        if (entity != null && entity.getType() === ENTITY_TYPE.IMAGE) {
          return '';
        }
        return content;
      })
      .join('')
      .replace(/\s\s+/g, ' ')
      .replace(/\]\s([.,;:!?)])/g, ']$1');
  }
}

async function stateToText(content) {
  const mg = new MarkupGenerator(content);
  return mg.generate();
}

export { stateToText };
