import {
  getEntityRanges,
  BLOCK_TYPE,
  ENTITY_TYPE,
  INLINE_STYLE,
} from 'draft-js-utils';

import { Entity } from 'draft-js';

const {
  CODE,
} = INLINE_STYLE;

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

// Escape quotes using backslash.
function escapeTitle(text) {
  return text.replace(/"/g, '\\"');
}

class MarkupGenerator {
  constructor(contentState) {
    this.contentState = contentState;
  }

  generate() {
    this.output = [];
    this.blocks = this.contentState.getBlockMap().toArray();
    this.totalBlocks = this.blocks.length;
    this.currentBlock = 0;
    this.listItemCounts = {};
    while (this.currentBlock < this.totalBlocks) {
      this.processBlock();
    }
    return this.output.join('');
  }

  processBlock() {
    const block = this.blocks[this.currentBlock];
    const blockType = block.getType();
    switch (blockType) {
      case BLOCK_TYPE.UNORDERED_LIST_ITEM: {
        const blockDepth = block.getDepth();
        const lastBlock = this.getLastBlock();
        const lastBlockType = lastBlock ? lastBlock.getType() : null;
        const lastBlockDepth = lastBlock && canHaveDepth(lastBlockType) ?
          lastBlock.getDepth() :
          null;
        if (
          lastBlockType !== blockType &&
          lastBlockDepth !== blockDepth - 1
        ) {
          this.insertLineBreaks(1);
          // Insert an additional line break if following opposite list type.
          if (lastBlockType === BLOCK_TYPE.ORDERED_LIST_ITEM) {
            this.insertLineBreaks(1);
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
        const lastBlockDepth = lastBlock && canHaveDepth(lastBlockType) ?
          lastBlock.getDepth() :
          null;
        if (lastBlockType !== blockType && lastBlockDepth !== blockDepth - 1) {
          this.insertLineBreaks(1);
          // Insert an additional line break if following opposite list type.
          if (lastBlockType === BLOCK_TYPE.UNORDERED_LIST_ITEM) {
            this.insertLineBreaks(1);
          }
        }
        const indent = ' '.repeat(blockDepth * 4);
        // TODO: figure out what to do with two-digit numbers
        const count = this.getListItemCount(block) % 10;
        this.output.push(`${indent}${count}. ${this.renderBlockContent(block)}\n`);
        break;
      }
      case BLOCK_TYPE.BLOCKQUOTE: {
        this.insertLineBreaks(1);
        this.output.push(` > ${this.renderBlockContent(block)}\n`);
        break;
      }
      case BLOCK_TYPE.CODE: {
        this.insertLineBreaks(1);
        this.output.push(`${CODE_INDENT + this.renderBlockContent(block)}\n`);
        break;
      }
      default: {
        this.insertLineBreaks(1);
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
    while (
      prevBlock &&
      canHaveDepth(prevBlock.getType()) &&
      prevBlock.getDepth() > blockDepth
    ) {
      index -= 1;
      prevBlock = this.blocks[index];
    }
    if (
      !prevBlock ||
      prevBlock.getType() !== blockType ||
      prevBlock.getDepth() !== blockDepth
    ) {
      this.listItemCounts[blockDepth] = 0;
    }
    return (
      this.listItemCounts[blockDepth] = this.listItemCounts[blockDepth] + 1
    );
  }

  insertLineBreaks() {
    if (this.currentBlock > 0) {
      this.output.push('\n');
    }
  }

  renderBlockContent(block) {
    const blockType = block.getType();
    const text = block.getText();
    if (text === '') {
      // Prevent element collapse if completely empty.
      // TODO: Replace with constant.
      return '\u200B';
    }
    const charMetaList = block.getCharacterList();
    const entityPieces = getEntityRanges(text, charMetaList);
    return entityPieces.map(([entityKey, stylePieces]) => {
      const content = stylePieces.map(([text2, style]) => {
        // Don't allow empty inline elements.
        if (!text2) {
          return '';
        }
        let content2 = encodeContent(text2);
        if (style.has(CODE)) {
          content2 = (blockType === BLOCK_TYPE.CODE) ? content2 : `\`${content2}\``;
        }
        return content2;
      }).join('');
      const entity = entityKey ? this.contentState.get(entityKey) : null;
      if (entity != null && entity.getType() === ENTITY_TYPE.LINK) {
        const data = entity.getData();
        const url = data.url || '';
        const title = data.title ? ` "${escapeTitle(data.title)}"` : '';
        return `[${content}](${encodeURL(url)}${title})`;
      }
      return content;
    }).join('');
  }
}

export default function stateToText(content) {
  return new MarkupGenerator(content).generate();
}
