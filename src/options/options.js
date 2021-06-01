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


function orderByOptionsChecked(element) {
    if (element.checked) {
        $(element).parent().addClass('selected');
    }
    else {
        $(element).parent().removeClass('selected');
    }
}

function setOptions(options) {

    let positions = [];

    orderByOptions.find('.order-by-option').each(function () {

        const checkbox = $(this).find('[type=checkbox]');
        const option = _.findWhere(options.orderByOptionsSettings, { value: checkbox.val() });

        if (option) {

            checkbox.prop("checked", option.selected);

            positions.push({ index: option.index, element: $(this) });
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

    orderByOptions.find('[type=checkbox]').change(function () {
        orderByOptionsChecked(this);
        refreshOrderByOptionsSettings();
    });

    setOptions(options);

    orderByOptions.sortable({
        placeholderClass: 'order-by-Option',
        handle: 'span',
        items: ':not(:has(:disabled))'

    }).bind('sortupdate', function (e, ui) {
        refreshOrderByOptionsSettings();
    });
}


optionsProvider.get(options => {
    bindOrderByOptions(options);
});

$('#saveChangesBtn').click(function () {
    optionsProvider.saveOrderByOptionsSettings(getorderByOptionsSettings());
});