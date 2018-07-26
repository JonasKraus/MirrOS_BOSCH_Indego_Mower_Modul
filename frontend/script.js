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

            window.setTimeout(function() {

                deauthenticate(data);
            }, 3000); // Deauthenticate after some time
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
            console.info(data);

            $('#indego_mower_state').html(codes[data.state]);
            $('#indego_mower_mowed').html(data.mowed + " %");
            $('#indego_mower_mowmode').html(data.mowmode);
            $('#indego_mower_runtimeTotal').html(JSON.stringify(data.runtime.total));
            $('#indego_mower_runtimeSession').html(JSON.stringify(data.runtime.session));
            $('#indego_mower_mapUpdate').html(data.map_update_available);
        });
    }


    /**
     * Requests the map as svg
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
            contentType: "application/json;charset=UTF-8",

        }).done(function(map) {
            console.info(map);

            saveMap(map);
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

