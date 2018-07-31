// Global vars
var indego_mower_username,
    indego_mower_password,
    indego_mower_options,
    url,

    codes = createStatusCodes(),
    codeIcons = getStatusCodeIcons();

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

    // Initially hidden elements
    $('#indego_mower_map_update_container').hide();

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

            requestGenericDeviceData(data);
            requestNextCutting(data);
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

            svg_xPos = data.svg_xPos;
            svg_yPos = data.svg_yPos;

            console.info(data);

            $('#indego_mower_state').hide();
            $('#indego_mower_state').html('<?php echo _("' + codes[data.state] + '"); ?>').fadeIn('slow');
            $('#indego_mower_state_icon').hide();
            $('#indego_mower_state_icon').attr('src', codeIcons[data.state]).fadeIn('slow');
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

            if (data.map_update_available) {
                $('#indego_mower_mapUpdate').html('<?php echo _(updating); ?>');
                $('#indego_mower_map_update_container').fadeIn('slow');
            } else {
                $('#indego_mower_mapUpdate').html('');
                $('#indego_mower_map_update_container').hide();
            }
        });
    }


    /**
     * Requests the current state of the mower
     *
     * @param credentials
     */
    function requestGenericDeviceData(credentials) {

        $.ajax({
            type: 'GET',
            url: url + "alms/" + credentials.alm_sn,
            headers: {
                "x-im-context-id":credentials.contextId
            },
            contentType: "application/json;charset=UTF-8",

        }).done(function(data) {


            $('#indego_mower_alm_mode').html(data.alm_mode);
            console.info(data);
        });
    }


    /**
     * Requests the current state of the mower
     *
     * @param credentials
     */
    function requestNextCutting(credentials) {

        $.ajax({
            type: 'GET',
            url: url + "alms/" + credentials.alm_sn + "/predictive/nextcutting",
            headers: {
                "x-im-context-id":credentials.contextId
            },
            contentType: "application/json;charset=UTF-8",

        }).done(function(data) {

            $('#indego_mower_mow_next').html(data.mow_next);
            console.info(data);
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

            $('#indego_mower_map').hide();
            $('#indego_mower_map_update_container').hide();
            $('#indego_mower_map').append(map).fadeIn('slow');

            var svg = $("#indego_mower_map").find('svg')[0];

            styleMap();
            addPositionToMap(svg);
            resizeSvg(svg, 150);
            $('#indego_mower_map').fadeIn('slow');

        }).error(function (error) {

            console.info(error);
        });
    }

    /**
     * Adds a circle as position of the mower to the map
     *
     * @param svg
     */
    function addPositionToMap(svg) {
        var svgNS = "http://www.w3.org/2000/svg";
        var pos = document.createElementNS(svgNS,"circle");
        pos.setAttributeNS(null,"id","mycircle");
        pos.setAttributeNS(null,"cx",svg_xPos);
        pos.setAttributeNS(null,"cy",1400-svg_yPos);
        pos.setAttributeNS(null,"r",20);
        pos.setAttributeNS(null,"fill","#000");
        pos.setAttributeNS(null,"stroke","black");
        pos.setAttributeNS(null,"stroke-width","40");

        var circle1 = document.createElementNS(svgNS,"circle");
        circle1.setAttributeNS(null,"id","mycircle");
        circle1.setAttributeNS(null,"cx",svg_xPos);
        circle1.setAttributeNS(null,"cy",1400-svg_yPos);
        circle1.setAttributeNS(null,"r",50);
        circle1.setAttributeNS(null,"fill","#000");
        circle1.setAttributeNS(null,"stroke","black");
        circle1.setAttributeNS(null,"stroke-width","40");
        var scale = document.createElementNS(svgNS,"animate");
        scale.setAttribute('attributeType', 'SVG');
        scale.setAttribute('attributeName', 'r');
        scale.setAttribute('begin', '0s');
        scale.setAttribute('dur', '3s');
        scale.setAttribute('repeatCount', 'indefinite');
        scale.setAttribute('from', '2%');
        scale.setAttribute('to', '20%');
        circle1.appendChild(scale);
        var fade = document.createElementNS(svgNS,"animate");
        fade.setAttribute('attributeType', 'CSS');
        fade.setAttribute('attributeName', 'opacity');
        fade.setAttribute('begin', '0s');
        fade.setAttribute('dur', '3s');
        fade.setAttribute('repeatCount', 'indefinite');
        fade.setAttribute('from', '.6');
        fade.setAttribute('to', '0');
        circle1.appendChild(fade);
        /*
        var stroke = document.createElementNS(svgNS,"animate");
        stroke.setAttribute('attributeType', 'CSS');
        stroke.setAttribute('attributeName', 'stroke-width');
        stroke.setAttribute('begin', '0s');
        stroke.setAttribute('dur', '1.5s');
        stroke.setAttribute('repeatCount', 'indefinite');
        stroke.setAttribute('from', '0%');
        stroke.setAttribute('to', '3%');
        myCircle.appendChild(stroke);
        */

        var circle2 = document.createElementNS(svgNS,"circle");
        circle2.setAttributeNS(null,"id","mycircle");
        circle2.setAttributeNS(null,"cx",svg_xPos);
        circle2.setAttributeNS(null,"cy",1400-svg_yPos);
        circle2.setAttributeNS(null,"r",50);
        circle2.setAttributeNS(null,"fill","#000");
        circle2.setAttributeNS(null,"stroke","black");
        circle2.setAttributeNS(null,"stroke-width","40");
        var scale2 = document.createElementNS(svgNS,"animate");
        scale2.setAttribute('attributeType', 'SVG');
        scale2.setAttribute('attributeName', 'r');
        scale2.setAttribute('begin', '1s');
        scale2.setAttribute('dur', '3s');
        scale2.setAttribute('repeatCount', 'indefinite');
        scale2.setAttribute('from', '2%');
        scale2.setAttribute('to', '20%');
        circle2.appendChild(scale2);
        var fade2 = document.createElementNS(svgNS,"animate");
        fade2.setAttribute('attributeType', 'CSS');
        fade2.setAttribute('attributeName', 'opacity');
        fade2.setAttribute('begin', '1s');
        fade2.setAttribute('dur', '3s');
        fade2.setAttribute('repeatCount', 'indefinite');
        fade2.setAttribute('from', '.6');
        fade2.setAttribute('to', '0');
        circle2.appendChild(fade2);
        svg.appendChild(circle1);
        svg.appendChild(circle2);
        svg.appendChild(pos);
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

        if (w < h){
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

        //alerts = createTestAlerts(); // TODO

        console.info(alerts);

        // Removing old rows from table
        $('tr.indego_mower_tr').remove();

        // Only displays the last alert
        var numOfDisplayedAlerts = 1; // TODO

        for(var i = 0; i < numOfDisplayedAlerts; i++) {

            // the current table row where data gets added
            var trHeadline = $('<tr class="indego_mower_tr"/>').hide();
            var trMessage = $('<tr class="indego_mower_tr"/>').hide();

            if (alerts[i] !== undefined) {
                var d = new Date(alerts[i].date);

                trHeadline.append("<td width='24'><img src='/modules/Indego_Mower/assets/alert.svg'/></td>");
                trHeadline.append("<td width='40'>" + d.getHours() + ":" + d.getMinutes() + "</td>");
                trHeadline.append("<td>" + alerts[i].headline + "</td>");
                trMessage.append("<td colspan='3'>" + alerts[i].message + "</td>");
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
 * creating an array with paths to status code icons
 *
 * @returns {{"0": string, "257": string, "258": string, "259": string, "260": string, "261": string, "262": string, "263": string, "513": string, "514": string, "515": string, "516": string, "517": string, "518": string, "519": string, "769": string, "770": string, "771": string, "772": string, "773": string, "774": string, "775": string, "776": string, "1025": string, "1026": string, "1281": string, "1537": string}}
 */
function getStatusCodeIcons() {

    const p = "/modules/Indego_Mower/assets/";
    return {
        0: p + "status.svg",
        257: p + "charging.svg",
        258: p + "docked.svg",
        259: p + "update.svg",
        260: p + "docked.svg",
        261: p + "docked.svg",
        262: p + "ic_map.svg",
        263: p + "ic_map.svg",
        513: p + "mowing.svg",
        514: p + "relocating.svg",
        515: p + "ic_map.svg",
        516: p + "learning_lawn.svg",
        517: p + "paused.svg",
        518: p + "mowing.svg",
        519: p + "idle.svg",
        769: p + "returning_to_dock.svg",
        770: p + "returning_to_dock.svg",
        771: p + "returning_to_dock.svg",
        772: p + "returning_to_dock.svg",
        773: p + "returning_to_dock.svg",
        774: p + "returning_to_dock.svg",
        775: p + "returning_to_dock.svg",
        776: p + "returning_to_dock.svg",
        1025: p + "status.svg",
        1026: p + "alert.svg",
        1281: p + "update.svg",
        1537: p + "alert.svg"
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

