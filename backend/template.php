<?php

_('indego_mower_title');
_('indego_mower_description');

$defaults = new StdClass();
$defaults->refreshInterval = 5;
$defaults->showMap = true;
$defaults->username = "";
$defaults->password = "";


$options = getConfigValue('indego_mower_options');
$username = getConfigValue('indego_mower_username');
$password = getConfigValue('indego_mower_password');


if (empty($options)) {
    $options = $defaults;
} else {
    $options = json_decode($options);
}


?>

<form id="indego_mower_form">

    <fieldset>
        <label for="indego_mower_username"><?php echo _('Username:') ?></label>
        <input id="indego_mower_username" type="text"  name="indego_mower_username" value="<?php echo $username; ?>" placeholder="max@mustermann.de" />

        <label for="indego_mower_password"><?php echo _('Password:') ?></label>
        <input id="indego_mower_password" type="text"  name="indego_mower_password" value="<?php echo $username; ?>" placeholder="top-secret123" />

        <label for="indego_mower_showMap"><?php echo _('Show map'); ?></label>
        <input type="checkbox"
               name="indego_mower_showMap"
               id="indego_mower_showMap"
            <?php print $options->showMap == true ? 'checked' : ''; ?>
        />

        <label for="indego_mower_refreshInterval"><?php echo _('Set refresh interval (Minutes)'); ?></label>
        <input type="number"
               name="indego_mower_refreshInterval"
               id="indego_mower_refreshInterval"
               step="1"
               min="1"
               max="3600"
               value="<?php print $options->refreshInterval; ?>"
        />

    </fieldset>

</form>

<div class="block__add" id="indego_mower__edit">
	<button class="indego_mower__edit--button" href="#">
		<span><?php echo _('save'); ?></span>
	</button>
</div>
