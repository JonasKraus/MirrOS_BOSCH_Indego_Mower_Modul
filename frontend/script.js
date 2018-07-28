// Global vars
var indego_mower_username,
    indego_mower_password,
    indego_mower_options,
    url,
    codes = createStatusCodes();

/**
 * On Ready
 */
$(document).ready(function () {


    indego_mower_username = "<?php echo getConfigValue('indego_mower_username'); ?>";
    indego_mower_password = "<?php echo getConfigValue('indego_mower_password'); ?>";
    indego_mower_options = JSON.parse('<?php echo getConfigValue("indego_mower_options"); ?>');

    if (indego_mower_options.showMap == null) {

        indego_mower_options.showMap = true;
    }

    if (indego_mower_options.refreshInterval == null) {

        indego_mower_options.refreshInterval = 5;
    }

    url = "https://api.indego.iot.bosch-si.com/api/v1/";

    reload();
});


/**
 * Reloading every X seconds
 */
function reload() {

    request();

    $(document).ready(function() {

        window.setTimeout(function() {

            reload(); // looping
        }, indego_mower_options.refreshInterval * 600000); // Multiply by 60000 to get milliseconds
    });


    /**
     * Sending the actual api request or get the next chunk
     * then creating the view
     */
    function request() {

        authenticate();
    }

    function authenticate() {

        console.info("**** start Authentication *****");

        authorization = btoa(indego_mower_username + ":" + indego_mower_password);

        $.ajax({
            type: 'POST',
            url: url + "authenticate",
            headers: {
                "Authorization":"Basic " + authorization
            },
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(
                {
                    device:"",
                    os_type:"Android",
                    os_version:"4.0",
                    dvc_manuf:"unknown",
                    dvc_type:"unknown"
                }
            )
        }).done(function(data) {
            console.info(data);

            alm_sn = data.alm_sn;
            contextId = data.contextId;
            userId = data.userId;

            requestState(data);
            requestMap(data);
            requestAlerts(data);

            window.setTimeout(function() {

                deauthenticate(data);
            }, 9000); // Deauthenticate after some time
        });
    }


    /**
     * Requests the current state of the mower
     *
     * @param credentials
     */
    function requestState(credentials) {

        $.ajax({
            type: 'GET',
            url: url + "alms/" + credentials.alm_sn + "/state",
            headers: {
                "x-im-context-id":credentials.contextId
            },
            contentType: "application/json;charset=UTF-8",

        }).done(function(data) {

            //data.mowed = 57; // TODO

            $('#indego_mower_state').html(codes[data.state]);
            $('#indego_mower_mowed_chart').html(data.mowed + " %");

            $('#indego_mower_chart_mowed').find('circle')[2].setAttribute('stroke-dasharray', data.mowed + ' ' + (100 - data.mowed));

            $('#indego_mower_mowmode').html(data.mowmode);

            $('#indego_mower_chart_runtime_total').find('rect')[0].setAttribute('width', 100 / (data.runtime.total.operate + data.runtime.total.charge) * data.runtime.total.operate);
            $('#indego_mower_chart_runtime_total').find('text')[0].setAttribute('x', 100 / (data.runtime.total.operate + data.runtime.total.charge) * data.runtime.total.operate + 5);
            $('#indego_mower_runtime_total_operate').html(timeConvert(data.runtime.total.operate));
            $('#indego_mower_chart_runtime_total').find('rect')[1].setAttribute('width', 100 / (data.runtime.total.operate + data.runtime.total.charge) * data.runtime.total.charge);
            $('#indego_mower_chart_runtime_total').find('text')[2].setAttribute('x', 100 / (data.runtime.total.operate + data.runtime.total.charge) * data.runtime.total.charge + 5);
            $('#indego_mower_runtime_total_charge').html(timeConvert(data.runtime.total.charge));

            $('#indego_mower_chart_runtime_session').find('rect')[0].setAttribute('width', 100 / (data.runtime.session.operate + data.runtime.session.charge) * data.runtime.session.operate);
            $('#indego_mower_chart_runtime_session').find('text')[0].setAttribute('x', 100 / (data.runtime.session.operate + data.runtime.session.charge) * data.runtime.session.operate + 5);
            $('#indego_mower_runtime_session_operate').html(timeConvert(data.runtime.session.operate));
            $('#indego_mower_chart_runtime_session').find('rect')[1].setAttribute('width', 100 / (data.runtime.session.operate + data.runtime.session.charge) * data.runtime.session.charge);
            $('#indego_mower_chart_runtime_session').find('text')[2].setAttribute('x', 100 / (data.runtime.session.operate + data.runtime.session.charge) * data.runtime.session.charge + 5);
            $('#indego_mower_runtime_session_charge').html(timeConvert(data.runtime.session.charge));

            $('#indego_mower_mapUpdate').html(data.map_update_available == true ? 'yes' : 'no');
        });
    }


    /**
     * Requests the map as svg
     * An image with content type "image/svg+xml; charset=utf-8"
     *
     * @param credentials
     */
    function requestMap(credentials) {

        $.ajax({
            type: 'GET',
            url: url + "alms/" + credentials.alm_sn + "/map",
            headers: {
                "x-im-context-id":credentials.contextId
            },
            //contentType: "application/svg+xml; charset=utf-8",
            dataType: "text",



        }).done(function(map) {

            $('#indego_mower_map').append(map);

            var svg = $("#indego_mower_map").find('svg')[0];


            styleMap();
            resizeSvg(svg, 150);

        });
    }


    /**
     * Edit style of map to match to the views theme
     */
    function styleMap() {

        $("#indego_mower_map").find('rect')[0].remove(); // Background
        $("#indego_mower_map").find('path')[0].remove(); // mash
        $("#indego_mower_map").find('polygon')[0].setAttribute('style','fill:#fff;'); // Fill map white
        $("#indego_mower_map").find('polygon')[1].remove();
    }


    /**
     * Resizing a given svg
     *
     * @param svg
     * @param size
     */
    function resizeSvg(svg, size) {

        if (svg == "undefined") return;

        var box = svg.viewBox.baseVal;
        var w = Math.round(box.width);
        var h = Math.round(box.height);

        var pw;
        var ph;

        if (w > h){
            pw = size;
            ph = pw * h/w;
        } else {
            ph = size;
            pw = ph * w/h;
        }
        svg.setAttribute('width', ph);
        svg.setAttribute('height', pw);
        svg.setAttribute('viewBox', '0 0 '+w+' '+h);
    }


    /**
     * Creating a table for displaying the alerts
     *
     * @param alerts
     */
    function createAlertsView(alerts) {

        alerts = createTestAlerts(); // TODO

        // Removing old rows from table
        $('tr.indego_mower_tr').remove();

        var numOfDisplayedAlerts = 1; // TODO

        for(var i = 0; i < numOfDisplayedAlerts; i++) {

            // the current table row where data gets added
            var trHeadline = $('<tr class="indego_mower_tr"/>').hide();
            var trMessage = $('<tr class="indego_mower_tr"/>').hide();

            if (alerts[i] !== undefined) {

                trHeadline.append("<td width='24'><img src='/modules/Indego_Mower/assets/alert.svg'/></td>");
                trHeadline.append("<td>" + alerts[i].headline + "</td>");
                trMessage.append("<td colspan='2'>" + alerts[i].message + "</td>");
            }

            // Appending the row to the table
            $('#indego_mower_table_alerts').append(trHeadline).append(trMessage);

            $(trHeadline).show('slow');
            $(trMessage).show('slow');
        }

    }

    /**
     * Requests the map as svg
     *
     * @param credentials
     */
    function requestAlerts(credentials) {

        $.ajax({
            type: 'GET',
            url: url + "alerts",
            headers: {
                "x-im-context-id":credentials.contextId
            },
            contentType: "application/json;charset=UTF-8",

        }).done(function(alerts) {

            createAlertsView(alerts);
        });
    }


    /**
     * invalidates the current context
     * (Should be done to eliminate side effects when other applications are also authenticated)
     *
     * @param credentials
     */
    function deauthenticate(credentials) {
        $.ajax({
            type: 'DELETE',
            url: url + "authenticate",
            headers: {
                "x-im-context-id":credentials.contextId
            },
            contentType: "application/json;charset=UTF-8",

        }).done(function(data) {
            console.info("***** deauthenticated *****");
        });
    }

    function saveMap(map) {
        $.ajax({
            type: "POST",
            url: "/modules/Indego_Mower/assets/saveMap.php",
            contentType: "text/xml",
            dataType: "xml",
            data: {
                data: map,
            },
            success: function (response) {

                // do something
            },
            error: function (error) {

                console.error(error);
            },
        });

    }

}


/**
 * Converts the time given as minutes to dd hh:mm
 *
 * @param time
 * @returns {string}
 */
function timeConvert(minutes) {

    var d = Math.floor(minutes / (60*24));
    var m = minutes - d * (60*24);
    var h = ("0" + Math.floor(m / 60)).slice(-2);

    m = ("0" + m % 60).slice(-2);

    if (d == 0) {

        return h + ":" + m;
    } else {

        return d + " "  + " " + h + ":" + m;
    }
}

/**
 * Generating array with status codes
 *
 * @returns status code array
 */
function createStatusCodes() {

    return {
        0:"Reading status",
        257: "Charging",
        258: "Docked",
        259: "Docked - Software update",
        260: "Docked",
        261: "Docked",
        262: "Docked - Loading map",
        263: "Docked - Saving map",
        513: "Mowing",
        514: "Relocating",
        515: "Loading map",
        516: "Learning lawn",
        517: "Paused",
        518: "Border cut",
        519: "Idle in lawn",
        769: "Returning to dock",
        770: "Returning to dock",
        771: "Returning to dock - Battery low",
        772: "Returning to dock - Calendar timeslot ended",
        773: "Returning to dock - Battery temp range",
        774: "Returning to dock - requested by user/app",
        775: "Returning to dock - Lawn complete",
        776: "Returning to dock - Relocating",
        1025: "Diagnostic mode",
        1026: "End of live",
        1281: "Software update",
        1537: "Stuck on lawn, help needed"
    }
}


/**
 * For testing only
 *
 * @returns {*[]}
 */
function createTestAlerts() {

    return [
        {
            alm_sn: "1234567890",
            alert_id: "12345678-abef-12de-3322-11aa22ee2387",
            headline: "Wartungshinweis.",
            date: "2016-05-14T16:29:31.123Z",
            message: "Messer prüfen. Ihr Indego hat 100 Stunden gemäht. Prüfen Sie bitte die Messer auf einwandfreien Zustand, damit weiterhin die optimale Leistung gewährleistet ist. ",
            read_status: "unread",
            flag: "warning"
        },
        {
            alm_sn: "1234567890",
            alert_id: "12345678-abef-12de-3322-11aa22ee2387",
            headline: "Mäher benötigt Hilfe.",
            date: "2016-05-14T14:10:23.112Z",
            message: "Begrenzungsdrahtsignal über längere Zeit nicht erkannt. Ihr Indego hat für einige Zeit das Begrenzungsdrahtsignal nicht erkannt. Bitte prüfen Sie die Anschlüsse der Ladestation und des Begrenzungsdrahts.",
            read_status: "unread",
            flag: "warning"
        }
    ];
}

