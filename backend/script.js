/**
 * Backend UI logic
 *
 */
$('#indego_mower__edit').click(function() {

    $.post('setConfigValueAjax.php', {'key' : 'indego_mower_username', 'value' : $('#indego_mower_username').val()});
    $.post('setConfigValueAjax.php', {'key' : 'indego_mower_password', 'value' : $('#indego_mower_password').val()});

    let showMap = $('#indego_mower_show_map').is(':checked');
    let refreshInterval = $('#indego_mower_refreshInterval').val();

    let options = {
        showMap: showMap,
        refreshInterval: refreshInterval
    };

    $.post('setConfigValueAjax.php', {'key': 'indego_mower_options', 'value': JSON.stringify(options)});

    $('#ok').show(30, function() {

        $(this).hide('slow');
    })
});
