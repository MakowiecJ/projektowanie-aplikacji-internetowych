FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
);

FilePond.setOptions({
    stylePanelAspectRatio: 90 / 180,
    imageResizeTargetWidth: 180,
    imageResizeTargetHeight: 90
})

FilePond.parse(document.body);