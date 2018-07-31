<h2 class="module__title">Indego Mower</h2>

<div>

    <figure class="float_left">
        <div id="indego_mower_chart_mowed" style="margin-left: -13px; margin-right: -20px;">
            <svg width="150" height="150" viewBox="0 0 42 42" class="donut circle-chart">
                <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#000"></circle>
                <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#333" stroke-width="0.5"></circle>
                <circle class="donut-segment circle-chart__circle" id="indego_mower_dounut-segment" cx="21" cy="21" r="15.91549430918954"
                        stroke-linecap="round"
                        fill="transparent" stroke="#fff" stroke-dasharray="0 100" stroke-width="1.5"></circle>

                <g class="chart-text">
                    <text x="50%" y="50%" id="indego_mower_mowed_chart" class="chart-number">
                    </text>
                    <text x="50%" y="50%" class="chart-label">
                        <?php echo _('mowed') ?>
                    </text>
                </g>
            </svg>
        </div>
    </figure>

    <figure class="float_left">
        <div id="indego_mower_state_container">
            <img id="indego_mower_state_icon" class="float_leftl" width="50" style="padding-top: 10px; display:block; margin:auto; filter: invert(100%);" />
            <p style="width: 150px;text-align: center; margin-bottom: 0px; margin-top: 6px;" id="indego_mower_state"></p>
        </div>
    </figure>

    <figure class="float_left">
        <figcaption class="fig-caption"><?php echo _('Runtime total') ?></figcaption>
        <div id="indego_mower_chart_runtime_total">
            <svg class="chart" width="160" height="100">
                <g class="bar">
                    <rect width="100" height="20"></rect>
                    <text class="bar-chart-label" x="105" y="11" dy="3"><?php echo _('operate') ?></text>
                    <text id="indego_mower_runtime_total_operate" class="bar-chart-label" x="0" y="30" dy="4"><?php echo _('DD HH MM') ?></text>
                </g>
                <g class="bar">
                    <rect width="80" height="20" y="49"></rect>
                    <text class="bar-chart-label" x="85" y="60" dy="3"><?php echo _('charge') ?></text>
                    <text id="indego_mower_runtime_total_charge" class="bar-chart-label" x="0" y="79" dy="4"><?php echo _('DD HH MM') ?></text>
                </g>
        </div>
    </figure>
    <figure class="float_left">
        <figcaption class="fig-caption"><?php echo _('Runtime session') ?></figcaption>
        <div id="indego_mower_chart_runtime_session">
            <svg class="chart" width="160" height="100">
                <g class="bar">
                    <rect width="100" height="20"></rect>
                    <text class="bar-chart-label" x="105" y="11" dy="3"><?php echo _('operate') ?></text>
                    <text id="indego_mower_runtime_session_operate" class="bar-chart-label" x="0" y="30" dy="4"><?php echo _('DD HH MM') ?></text>
                </g>
                <g class="bar">
                    <rect width="80" height="20" y="49"></rect>
                    <text class="bar-chart-label" x="85" y="60" dy="3"><?php echo _('charge') ?></text>
                    <text id="indego_mower_runtime_session_charge" class="bar-chart-label" x="0" y="79" dy="4"><?php echo _('DD HH MM') ?></text>
                </g>
        </div>
    </figure>
    <figure class="float_left">
        <div id="indego_mower_map">
            <div id="indego_mower_map_update_container">
                <img id="indego_mower_ic_map" src="/modules/Indego_Mower/assets/ic_map.svg" width="50" style="padding-top: 10px; display:block; margin:auto; filter: invert(100%);">
                <p style="text-align: center;  margin-bottom: 0px; margin-top: 6px;" id="indego_mower_mapUpdate"></p>
            </div>

        </div>
    </figure>

    <div class="float_left">
        <table class="indego_mower_table">
            <tbody>
            <tr>
                <td class="indego_mower_text_align_right"><?php echo _('mow mode') ?></td>
                <td id="indego_mower_mowmode">-</td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="float_left">
        <table style="table-layout: auto" id="indego_mower_table_alerts">
        </table>
    </div>

</div>


