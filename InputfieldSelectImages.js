(function($) {

	// Initialise InputfieldSelectImages
	function initSelectImages($inputfield) {
		checkMaxItems($inputfield);
		$inputfield.find('.selected-images').sortable({
			update: function(event, ui) {
				var $inputfield = $(event.target).closest('.InputfieldSelectImages');
				setSelectImagesValue($inputfield);
			}
		});
	}

	// Set value to InputfieldSelectImages
	function setSelectImagesValue($inputfield) {
		var $input = $inputfield.find('select[multiple]');
		$input.find('option').remove();
		var $selected = $inputfield.find('.selected-images .isi-thumb');
		var $empty_label = $inputfield.find('.empty-label');
		if($selected.length) {
			$selected.each(function() {
				var value = $(this).data('value');
				$input.append('<option value="' + value + '" selected>' + value + '</option>')
			});
			$empty_label.hide();
		} else {
			$empty_label.show();
		}
		$input.trigger('change');
		checkMaxItems($inputfield);
	}

	// Close the selectable images container
	function closeSelectable($outer) {
		var $button = $outer.siblings('.isi-select-button');
		$button.text($button.data('open-label'));
		$outer.slideUp(300);
	}

	// Check if the maximum number of selected items has been reached
	function checkMaxItems($inputfield) {
		var max = $inputfield.data('max-items');
		if(max === 0) return;
		var selected_count = $inputfield.find('.selected-images .isi-thumb').length;
		var $button = $inputfield.find('.isi-select-button');
		if(selected_count >= max) {
			$button.prop('disabled', true);
			$button.attr('title', $button.data('max-reached'));
			closeSelectable($inputfield.find('.selectable-images-outer'));
		} else {
			$button.attr('title', '');
			$button.prop('disabled', false);
		}
	}

	$(document).ready(function() {

		// Init on DOM ready
		$('.InputfieldSelectImages').each(function() {
			initSelectImages($(this));
		});

		// Init when inputfield reloaded
		$(document).on('reloaded', '.InputfieldSelectImages', function() {
			initSelectImages($(this));
		});

		// Select images button clicked
		$(document).on('click', '.InputfieldSelectImages .isi-select-button', function() {
			var $outer = $(this).siblings('.selectable-images-outer');
			if($outer.is(':visible')) {
				closeSelectable($outer);
			} else {
				$(this).text($(this).data('close-label'));
				$outer.slideDown(300);
			}
		});

		// Selectable image clicked
		$(document).on('click', '.InputfieldSelectImages .selectable-images .isi-thumb:not(.selected)', function() {
			var $inputfield = $(this).closest('.InputfieldSelectImages');
			$(this).addClass('selected');
			$inputfield.find('.selected-images').append($(this).clone());
			setSelectImagesValue($inputfield);
		});

		// Delete icon clicked
		$(document).on('click', '.InputfieldSelectImages .selected-images .isi-delete', function() {
			var $inputfield = $(this).closest('.InputfieldSelectImages');
			var $thumb = $(this).closest('.isi-thumb');
			$inputfield.find('.selectable-images .isi-thumb[data-value="' + $thumb.data('value') + '"]').removeClass('selected');
			$thumb.remove();
			setSelectImagesValue($inputfield);
		});

	});

}(jQuery));
