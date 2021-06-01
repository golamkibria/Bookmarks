const orderByOptions = $('#orderByOptions');


function showOrderBySettings(orderByOptionsSettings) {

    let parts = [];

    _.each(orderByOptionsSettings, option => {

        if (option.selected) {
            parts.push(option.value);
        }
    });

    let text = null;
    if (parts.length > 0) {
        text = 'Sort by ' + parts.join(' <i>then by</i> ') + '.';
    }

    $('#orderByOptionsTxt').html(text);
}

function getorderByOptionsSettings() {

    let orderByOptionsSettings = [];

    orderByOptions.find('[type=checkbox]').each(function (index) {
        orderByOptionsSettings.push({ index: index, value: $(this).val(), selected: $(this).is(':checked') });
    });

    console.log(orderByOptionsSettings);

    return orderByOptionsSettings;
}

function refreshOrderByOptionsSettings() {
    showOrderBySettings(getorderByOptionsSettings());
}


function orderByOptionsChecked(checkbox) {

    if (checkbox.prop('checked')) {
        checkbox.parent('.order-by-option').addClass('selected');
    }
    else {
        checkbox.parent('.order-by-option').removeClass('selected');
    }
}

function setOptions(options) {

    let positions = [];

    orderByOptions.find('.order-by-option').each(function (i) {

        const checkbox = $(this).find('[type=checkbox]');
        const option = _.findWhere(options.orderByOptionsSettings, { value: checkbox.val() });

        if (option) {

            checkbox.prop("checked", option.selected);

            positions.push({ index: option.index, element: $(this) });
        }
        else {
            positions.push({ index: i, element: $(this) });
        }
    });

    if (positions.length) {
        orderByOptions.empty();

        positions = _.sortBy(positions, item => item.index);

        _.each(positions, function (item) {
            orderByOptions.append(item.element);
        });
    }

}


function bindOrderByOptions(options) {

    setOptions(options);

    orderByOptions.sortable({
        placeholderClass: 'order-by-Option',
        handle: 'span',
        items: ':not(:has(:disabled))'

    }).bind('sortupdate', function (e, ui) {
        refreshOrderByOptionsSettings();
    });


    orderByOptions.find('[type=checkbox]').bind('change', function () {
        orderByOptionsChecked($(this));
        refreshOrderByOptionsSettings();
    });

    orderByOptions.find('[type=checkbox]').each(function () {
        orderByOptionsChecked($(this));
    });
    refreshOrderByOptionsSettings();
}


optionsProvider.get(options => {
    bindOrderByOptions(options);
});

$('#saveChangesBtn').click(function () {
    optionsProvider.saveOrderByOptionsSettings(getorderByOptionsSettings());
});