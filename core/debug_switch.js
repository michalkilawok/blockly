/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2015 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Object representing a zoom icons.
 * @author michal.kowalik@ocado.com (Michal Kowalik)
 */
'use strict';

goog.provide('Blockly.DebugSwitch');

goog.require('goog.dom');


/**
 * Class for a debug switch.
 * @param {!Blockly.Workspace} workspace The workspace to sit in.
 * @constructor
 */
Blockly.DebugSwitch = function(workspace) {
  this.workspace_ = workspace;
};

/**
 * Width of the debug switch.
 * @type {number}
 * @private
 */
Blockly.DebugSwitch.prototype.WIDTH_ = 32;

/**
 * Height of the debug switch.
 * @type {number}
 * @private
 */
Blockly.DebugSwitch.prototype.HEIGHT_ = 32;

/**
 * Distance between debug switch and bottom edge of workspace.
 * @type {number}
 * @private
 */
Blockly.DebugSwitch.prototype.MARGIN_BOTTOM_ = 10;

/**
 * Distance between debug switch and right edge of workspace.
 * @type {number}
 * @private
 */
Blockly.DebugSwitch.prototype.MARGIN_SIDE_ = 20;

/**
 * The SVG group containing the debug switch.
 * @type {Element}
 * @private
 */
Blockly.DebugSwitch.prototype.svgGroup_ = null;

/**
 * Left coordinate of the debug switch.
 * @type {number}
 * @private
 */
Blockly.DebugSwitch.prototype.left_ = 0;

/**
 * Top coordinate of the debug switch.
 * @type {number}
 * @private
 */
Blockly.DebugSwitch.prototype.top_ = 0;

/**
 * Create the debug switch.
 * @return {!Element} The debug switch SVG group.
 */
Blockly.DebugSwitch.prototype.createDom = function() {
  var workspace = this.workspace_;
  /* Here's the markup that will be generated:
    <g class="blocklyDebug" transform="translate(1278,292)">
        <clipPath id="blocklyDebugswitchClipPath5434831629972905">
            <rect width="32" height="32"></rect>
        </clipPath>
        <image width="96" height="124" x="-64" clip-path="url(#blocklyDebugswitchClipPath5434831629972905)"
            xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="media/sprites.png">
        </image>
    </g>
  */
  this.svgGroup_ = Blockly.createSvgElement('g', {'class': 'blocklyDebug'}, null);
  var rnd = String(Math.random()).substring(2);
  var clip = Blockly.createSvgElement('clipPath',
    {'id': 'blocklyDebugswitchClipPath' + rnd},
    this.svgGroup_);
  Blockly.createSvgElement('rect', {'width': 32, 'height': 32}, clip);
  var debugswitchSvg = Blockly.createSvgElement('image',
    {'width': Blockly.SPRITE.width,
     'height': Blockly.SPRITE.height,
     'x': 32 - Blockly.SPRITE.width,
     'clip-path': 'url(#blocklyDebugswitchClipPath' + rnd + ')'},
    this.svgGroup_);
  debugswitchSvg.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'xlink:href',
    workspace.options.pathToMedia + Blockly.SPRITE.url);

  // Attach event listeners.
  Blockly.bindEvent_(debugswitchSvg, 'mousedown', workspace, workspace.switchDebug);

  return this.svgGroup_;
};

/**
 * Initialize the debug switch.
 * @param {number} bottom Distance from workspace bottom to bottom of switch.
 * @return {number} Distance from workspace bottom to the top of switch.
 */
Blockly.DebugSwitch.prototype.init = function(bottom) {
  this.bottom_ = this.MARGIN_BOTTOM_ + bottom;
  return this.bottom_ + this.HEIGHT_;
};

/**
 * Dispose of this debug switch.
 * Unlink from all DOM elements to prevent memory leaks.
 */
Blockly.DebugSwitch.prototype.dispose = function() {
  if (this.svgGroup_) {
    goog.dom.removeNode(this.svgGroup_);
    this.svgGroup_ = null;
  }
  this.workspace_ = null;
};

/**
 * Move the debug switch to the bottom-right corner.
 */
Blockly.DebugSwitch.prototype.position = function() {
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    // There are no metrics available (workspace is probably not visible).
    return;
  }
  if (this.workspace_.RTL) {
    this.left_ = this.MARGIN_SIDE_ + Blockly.Scrollbar.scrollbarThickness;
  } else {
    this.left_ = metrics.viewWidth + metrics.absoluteLeft -
        this.WIDTH_ - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;
  }
  this.top_ = metrics.viewHeight + metrics.absoluteTop -
      this.HEIGHT_ - this.bottom_;
  this.svgGroup_.setAttribute('transform',
      'translate(' + this.left_ + ',' + this.top_ + ')');
};
