# Select Images 

A module for ProcessWire CMS/CMF. An inputfield that allows the visual selection and sorting of images, intended for use with the [FieldtypeDynamicOptions](https://github.com/Toutouwai/FieldtypeDynamicOptions) module. Together these modules can be used to create a kind of "[image reference](https://github.com/processwire/processwire-requests/issues/207)" field.

![select-images](https://user-images.githubusercontent.com/1538852/115172433-6115b900-a119-11eb-8272-9363cc5f30ab.gif)

## Integration with FieldtypeDynamicOptions

InputfieldSelectImages was developed to be used together with [FieldtypeDynamicOptions](https://github.com/Toutouwai/FieldtypeDynamicOptions) (v0.1.3 or newer):

1. Create a Dynamic Options field.
2. Choose "Select Images" as the "Inputfield type". Select Images appears in the "Multiple item selection" category but you can set "Maximum number of items" to 1 if you want to use Select Images for single image selections.
3. Define selectable options for the field via a `FieldtypeDynamicOptions::getSelectableOptions` hook. See some examples below.

FieldtypeDynamicOptions is recommended but is not a strict requirement for installing InputfieldSelectImages in case you want to use an alternative way to store the field data.

### Selection of Pageimages

In this example the field allows selection of Pageimages that are in the "images" field of the home page.

The field will store URLs to the Pageimages so it works as a kind of "image reference" field. You can use the "Format as Pagefile/Pageimage object(s)" option for the Dynamic Options field to have the formatted value of the field be automatically converted from the stored Pageimage URLs to Pageimage objects. 

```php
$wire->addHookAfter('FieldtypeDynamicOptions::getSelectableOptions', function(HookEvent $event) {
    // The page being edited
    $page = $event->arguments(0);
    // The Dynamic Options field
    $field = $event->arguments(1);

    // For a field named "select_images"
    if($field->name === 'select_images') {
        $options = [];
        // Get Pageimages within the "images" field on the home page
        foreach($event->wire()->pages(1)->images as $image) {
            // Add an option for each Pageimage
            // When the key is a Pageimage URL the inputfield will automatically create a thumbnail
            // In this example the label includes the basename and the filesize
            /** @var Pageimage $image */
            $options[$image->url] = "{$image->basename}<br>{$image->filesizeStr}";
        }
        $event->return = $options;
    }
});
```

### Selection of image files not associated with a Page

When not working with Pageimages you must add a "data-thumb" attribute for each selectable option which contains a URL to a thumbnail/image.

In this example the field allows selection of image files in a "/pics/" folder which is in the site root.

```php
$wire->addHookAfter('FieldtypeDynamicOptions::getSelectableOptions', function(HookEvent $event) {
    // The page being edited
    $page = $event->arguments(0);
    // The Dynamic Options field
    $field = $event->arguments(1);

    // For a field named "select_images"
    if($field->name === 'select_images') {
        $options = [];
        // Get files that are in the /pics/ folder
        $root = $event->wire()->config->paths->root;
        $path = $root . 'pics/';
        $files = $event->wire()->files->find($path);
        // Add an option for each file
        foreach($files as $file) {
            $basename = str_replace($path, '', $file);
            $url = str_replace($root, '/', $file);
            // The value must be an array with the following structure...
            $options[$url] = [
                // The label for the image
                'label' => $basename,
                'attributes' => [
                    // An image URL in the "data-thumb" attribute
                    'data-thumb' => $url,
                ],
            ];
        }
        $event->return = $options;
    }
});
```

### The field values don't have to be image URLs

The values stored by the Dynamic Options field don't have to be image URLs. For example, you could use the images to represent different layout options for a page, or to represent widgets that will be inserted on the page.

Also, you can use external URLs for the thumbnails. In the example below the options "calm" and "crazy" are represented by thumbnails from [placecage.com](https://www.placecage.com/).

```php
$wire->addHookAfter('FieldtypeDynamicOptions::getSelectableOptions', function(HookEvent $event) {
    // The page being edited
    $page = $event->arguments(0);
    // The Dynamic Options field
    $field = $event->arguments(1);

    // For a field named "calm_or_crazy"
    if($field->name === 'calm_or_crazy') {
        $options = [];
        // Add options that are illustrated with thumbnails from placecage.com
        $options['calm'] = [
            // The label for the option
            'label' => 'Nicolas Cage is a calm man',
            'attributes' => [
                // An image URL in the "data-thumb" attribute
                'data-thumb' => 'https://www.placecage.com/260/260',
            ]
        ];
        $options['crazy'] = [
            // The label for the option
            'label' => 'Nicolas Cage is a crazy man',
            'attributes' => [
                // An image URL in the "data-thumb" attribute
                'data-thumb' => 'https://www.placecage.com/c/260/260',
            ]
        ];
        $event->return = $options;
    }
});
```

## Field configuration

You can define labels for the button, notices, etc, that are used within the inputfield if the defaults don't suit.

![labels](https://user-images.githubusercontent.com/1538852/126757906-76c4552d-7165-4e4f-aa8e-a3c64f5d274f.png)
