import "tom-select/dist/css/tom-select.default.css";
import "./styles.css"
import {checkAuth} from './auth.js';
import {setupSearch} from './search.js';

class GBIAccountNav {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.init();
  }

  init() {
    this.container.innerHTML = `
        <nav class="navbar">
          <div class="search-container">
            <div class="search-wrapper">
              <select class="site-wide-search"> </select>
              <div class="search-icon">
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="logged-out-actions" style="display: none;">
            <button class="first-button">CREATE ACCOUNT</button>
            <button class="second-button">LOGIN</button>
          </div>
          <div class="logged-in-actions" style="display: none;">
              <button class="first-button">MY ACCOUNT</button>
              <button class="second-button">LOGOUT</button>
          </div>
        </nav>
        `;
    checkAuth();
    setupSearch();
  }
}

window.GBIAccountNav = GBIAccountNav;