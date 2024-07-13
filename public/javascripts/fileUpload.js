const rootStyles = window.getComputedStyle(document.documentElement);

if (rootStyles.getPropertyValue('--image-width-large') != null && rootStyles.getPropertyValue('--image-width-large') !== '') {
    loadPond();
} else {
    document.getElementById('main-css').addEventListener('load', loadPond);
}

function loadPond() {
    const width = parseFloat(rootStyles.getPropertyValue('--image-width-large'));
    const ratio = parseFloat(rootStyles.getPropertyValue('--image-aspect-ratio'));
    const height = width * ratio;

    console.log(width, ratio, height);

    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode
    );
    
    FilePond.setOptions({
        stylePanelAspectRatio: ratio,
        imageResizeTargetWidth: width,
        imageResizeTargetHeight: height
    })
    
    FilePond.parse(document.body);
}
