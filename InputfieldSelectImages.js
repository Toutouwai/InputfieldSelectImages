(function($) {

	// Initialise InputfieldSelectImages
	function initSelectImages($inputfield) {
		checkMaxItems($inputfield);
		// Make sortable if inputfield allows multiple images
		if(!$inputfield.hasClass('isi-single')) {
			$inputfield.find('.selected-images').sortable({
				update: function(event, ui) {
					var $inputfield = $(event.target).closest('.InputfieldSelectImages');
					setSelectImagesValue($inputfield);
				}
			});
		}
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

	// Check if the maximum number of selected items has been reached
	function checkMaxItems($inputfield) {
		var max = $inputfield.data('max-items');
		if(max === 0) return;
		var selected_count = $inputfield.find('.selected-images .isi-thumb').length;
		var $button = $inputfield.find('.isi-select-button');
		var label = $button.data('open-label');
		if(selected_count >= max) {
			if($inputfield.hasClass('isi-single')) {
				label = $button.data('replace-label');
				$button.attr('data-action', 'replace');
			} else {
				$button.prop('disabled', true);
				$button.attr('title', $button.data('max-reached'));
			}
			// Have to hide instead of slideUp due to buggy Uikit match height
			$inputfield.find('.selectable-images-outer').hide();
		} else {
			$button.attr('data-action', 'open');
			$button.attr('title', '');
			$button.prop('disabled', false);
		}
		$button.text(label);
	}

	// Remove a selected thumb
	function removeThumb($inputfield, $thumb) {
		$inputfield.find('.selectable-images .isi-thumb[data-value="' + $thumb.data('value') + '"]').removeClass('selected');
		$thumb.remove();
		setSelectImagesValue($inputfield);
	}

	// DOM ready
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
			var $inputfield = $(this).closest('.InputfieldSelectImages');
			if($outer.is(':visible')) {
				// Have to hide instead of slideUp due to buggy Uikit match height
				$inputfield.find('.selectable-images-outer').hide();
				checkMaxItems($inputfield); // Mainly to set correct button label depending on context
			} else {
				$(this).text($(this).data('close-label'));
				$outer.slideDown(300);
			}
		});

		// Selectable image clicked
		$(document).on('click', '.InputfieldSelectImages .selectable-images .isi-thumb:not(.selected)', function() {
			var $inputfield = $(this).closest('.InputfieldSelectImages');
			if($inputfield.hasClass('isi-single')) {
				var $thumb = $inputfield.find('.selected-images .isi-thumb');
				removeThumb($inputfield, $thumb);
			}
			$(this).addClass('selected');
			$inputfield.find('.selected-images').append($(this).clone());
			setSelectImagesValue($inputfield);
		});

		// Delete icon clicked
		$(document).on('click', '.InputfieldSelectImages .selected-images .isi-delete', function() {
			var $inputfield = $(this).closest('.InputfieldSelectImages');
			var $thumb = $(this).closest('.isi-thumb');
			removeThumb($inputfield, $thumb);
		});

	});

}(jQuery));
