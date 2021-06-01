
var optionsProvider = (function () {

    const options = {};

    const orderByOptionsSettingsDefault = [
        { index: 0, value: 'Folder', selected: true },
        { index: 1, value: 'Title', selected: true },
        { index: 2, value: 'Hostname', selected: false },
        { index: 3, value: 'Url', selected: false }
    ];


    return {
        get: function (callback) {

            return chrome.storage.sync.get('options', (data) => {

                if(data.options){
                    Object.assign(options, data.options);
                }

                if (!options.orderByOptionsSettings) {
                    options.orderByOptionsSettings = orderByOptionsSettingsDefault;
                }

                console.log("optionsProvider: options", options);
                
                if(callback){                    
                    callback(options);
                }

                return options;
            });
        },

        save: function () {
            chrome.storage.sync.set({ options });
        },

        saveOrderByOptionsSettings: function (orderByOptionsSettings) {

            options.orderByOptionsSettings = orderByOptionsSettings;

            chrome.storage.sync.set({ options }, () => {
                console.log('SaveOrderByOptionsSettings', orderByOptionsSettings);
            });
        }
    };
})();