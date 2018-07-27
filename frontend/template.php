<h2 class="module__title">Indego Mower</h2>

<div>

    <figure class="float_left">
        <div id="indego_mower_chart_mowed">
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
        <figcaption class="fig-caption"><?php echo _('Runtime total') ?></figcaption>
        <div id="indego_mower_chart_runtime_total">
            <svg class="chart" width="200" height="100">
                <g class="bar">
                    <rect width="100" height="20"></rect>
                    <text class="bar-chart-label" x="105" y="11" dy="3"><?php echo _('operate') ?></text>
                    <text class="bar-chart-label" x="0" y="30" dy="4"><?php echo _('DD HH MM') ?></text>
                </g>
                <g class="bar">
                    <rect width="80" height="20" y="49"></rect>
                    <text class="bar-chart-label" x="85" y="60" dy="3"><?php echo _('charge') ?></text>
                    <text class="bar-chart-label" x="0" y="79" dy="4"><?php echo _('DD HH MM') ?></text>
                </g>
        </div>
    </figure>
    <figure class="float_left">
        <figcaption class="fig-caption"><?php echo _('Runtime session') ?></figcaption>
        <div id="indego_mower_chart_runtime_session">
            <svg class="chart" width="200" height="100">
                <g class="bar">
                    <rect width="100" height="20"></rect>
                    <text class="bar-chart-label" x="105" y="11" dy="3"><?php echo _('operate') ?></text>
                    <text class="bar-chart-label" x="0" y="30" dy="4"><?php echo _('DD HH MM') ?></text>
                </g>
                <g class="bar">
                    <rect width="80" height="20" y="49"></rect>
                    <text class="bar-chart-label" x="85" y="60" dy="3"><?php echo _('charge') ?></text>
                    <text class="bar-chart-label" x="0" y="79" dy="4"><?php echo _('DD HH MM') ?></text>
                </g>
        </div>
    </figure>

    <figure class="float_left">
        <div id="indego_mower_map"></div>
    </figure>

    <div class="float_left">
        <table class="indego_mower_table">
            <tbody>
            <tr>
                <td class="indego_mower_text_align_right"><?php echo _('state') ?></td>
                <td id="indego_mower_state">-</td>
            </tr>
            <tr>
                <td class="indego_mower_text_align_right"><?php echo _('mow mode') ?></td>
                <td id="indego_mower_mowmode">-</td>
            </tr>
            <tr>
                <td class="indego_mower_text_align_right"><?php echo _('runtime total') ?></td>
                <td id="indego_mower_runtimeTotal">-</td>
            </tr>
            <tr>
                <td class="indego_mower_text_align_right"><?php echo _('runtime session') ?></td>
                <td id="indego_mower_runtimeSession">-</td>
            </tr>
            <tr>
                <td class="indego_mower_text_align_right"><?php echo _('map update avail') ?></td>
                <td id="indego_mower_mapUpdate">-</td>
            </tr>
            </tbody>
        </table>
    </div>
    <div class="float_left">
        <table id="indego_mower_table_alerts">
        </table>
    </div>

</div>


