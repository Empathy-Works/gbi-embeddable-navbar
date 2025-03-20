import TomSelect from "tom-select";

export function setupSearch() {
  const gbiSite = 'https://app.thegbi.org';
  const appSearchUrl = `${gbiSite}/search/app/`;
  const marketingSearchUrl = `${gbiSite}/search/marketing/`;

  let select = new TomSelect('.site-wide-search', {
    valueField: "url",
    labelField: "title",
    searchField: [], //Setting this to empty string will disable searching on the client side(https://github.com/orchidjs/tom-select/issues/78)
    loadThrottle: 500, // slightly increase default throttle value
    optgroupField: "class",
    maxOptions: null, // setting this to null will show all possible options
    optgroups: {},
    preload: "focus", //Setting this to true will call load function on page load
    closeAfterSelect: true,
    sortField: [{field: "$order"}, {field: "$score"}], //To disable sorting entirely and maintain the original order of options
    placeholder: "Search",

    // fetch remote data
    load: function (query, callback) {
      if (!query.length) {
        callback();
        return;
      }

      let searchUrls = [
        `${appSearchUrl}?search_text=${encodeURIComponent(query)}`,
        `${marketingSearchUrl}?search_text=${encodeURIComponent(query)}`,
      ];

      this.clearOptions();
      let groups = {};
      let pendingRequests = searchUrls.length;

      // Set loading state
      this.settings.loading = true;

      searchUrls.forEach((url) => {
        fetch(url)
          .then((response) => response.json())
          .then((result) => {
            const items = result.items;

            items.forEach((item) => {
              if (item.group && !groups[item.group]) {
                groups[item.group] = { label: item.group, value: item.group };
                this.addOptionGroup(item.group, groups[item.group]);
              }
            });

            this.addOption(items);
            // Call callback after each response to refresh the dropdown
            callback();
          })
          .catch((error) => {
            console.error(`Failed to fetch results from ${url}`, error);
          })
          .finally(() => {
            pendingRequests--;
            if (pendingRequests === 0) {
              // Clear loading state when all requests are done
              this.settings.loading = false;
              callback();
            }
          });
      });
    },
    //Take the user to option's url on clicking or hitting enter
    onChange: function (value) {
      if (!value.startsWith('http')) value = gbiSite + value
      window.location = value;
    },
    // custom rendering functions for options and items
    render:
      {
        //Render the option groups
        optgroup_header: function (item, escape) {
          return `<div class="optgroup-header" notranslate>${escape(item.label)}</div>`;
        }
        ,
        option: function (item, escape) {
          return `<div class="ts-option" notranslate>
                    <div><i class="${item.icon}"></i>${escape(item.title)}</div>
                </div>`;
        }
        ,
        item: function (item, escape) {
          return `<div class="ts-item" notranslate>
                    <div>${escape(item.title)}</div>
                  </div>`;
        },
        dropdown: function () {
          return '<div notranslate></div>'; /* do not translate any of the search dropdown into other languages */
        },
        no_results: function() {
          return `<div class="no-results">${this.settings.loading ? "Searching..." : "No results found" }</div>`;
        },
      }
    ,
  });

  const searchWrapper = document.querySelector('.search-wrapper');
  const searchIcon = document.querySelector('.search-icon');
  const tsControl = document.querySelector('.ts-control');
  // Reference to the search container for the click-outside logic
  const searchContainer = document.querySelector('.search-container');

  // Toggle the search select visibility on icon click
  searchIcon.addEventListener('click', (e) => {
    searchWrapper.classList.add('expanded');
    tsControl.classList.add('expanded');
    setTimeout(() => {
      select.enable();
      select.focus();
    }, 150); // Delay the focus to give time for the select to expand
  });

  // Collapse the search select when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) {
      searchWrapper.classList.remove('expanded');
      tsControl.classList.remove('expanded');
      select.blur(); // Remove focus when collapsed
    }
  });
}