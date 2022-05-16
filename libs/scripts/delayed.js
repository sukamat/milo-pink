/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* globals */
// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './scripts.js';
import { loadScript } from '../utils/utils.js'

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

if (document.querySelector('.article-header') && !document.querySelector('[data-origin]')) {
  loadScript('/blocks/interlinks/interlinks.js', 'module');
}

/**
 * Adds link tracking to all links under a certain block based off a class delimiter.
 * Block class identification is provided in the instrumentation file.
 */
async function setupLinkTracking() {
  const resp = await fetch('/blog/instrumentation.json');
  const json = await resp.json();
  const linkTracking = json['link-tracking'].data;
  linkTracking.forEach((entry) => {
    // eslint-disable-next-line no-underscore-dangle
    document.querySelectorAll(entry.selector).forEach((el) => {
      el.setAttribute('daa-lh', el.getAttribute('data-block-name'));
      el.querySelectorAll('a').forEach((a) => {
        if (a.href) {
          let value = '';
          const img = a.querySelector('img');
          if (img) {
            value = img.getAttribute('alt');
          } else {
            value = a.textContent.substr(0, 64);
          }
          a.setAttribute('daa-ll', value);
        }
      });
    });
  });
}

setupLinkTracking();
