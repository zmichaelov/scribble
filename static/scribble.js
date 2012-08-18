
// enable our split editor view
$(document).ready(function () {
    $('#editor').jqxSplitter({ width: "inherit", height: "inherit", 
    panels: [{ collapsible: false }, { collapsible: false}] });
});

// stylesheet used to render the preview
var css = "<head><link href=\"static/styles/markdown.css\" rel=\"stylesheet\"/></head>";
var converter = new Showdown.converter();
var delay;
// initial update of our file list
updateFilelist();

// Initialize CodeMirror editor
var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'markdown',
        tabMode: 'indent',
        lineNumbers: true,
        onChange: function() {
        clearTimeout(delay);
        delay = setTimeout(updatePreview, 300);
    }
});

function zPrint(frame) {
    frame.focus();
    frame.print();
}

function newEditor() {
    editor.setValue("");
}

function save() {   
    var filename = $('#filename').val();
    localStorage.setItem(filename, editor.getValue().trim());
    updateFilelist();

    $('#saveModal').modal('hide');
}

function updateFilelist() {
    $('#filelist').empty();
    var s = localStorage;
    for( var i = 0; i < s.length; i++) {
        $("#filelist").append("<lid><a class=open href=\"#\">"+s.key(i)+"</a></li>");
    }
}

// called to render our preview
function updatePreview() {
    var previewFrame = document.getElementById('preview');
    var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
    preview.open();
    var html = converter.makeHtml(editor.getValue().trim());             
    preview.write("<html>"+css+html+"</html>");
}
setTimeout(updatePreview, 300);

$(".open").click(function(event) {
    var filename = this.text;
    var file = localStorage.getItem(filename);
    if (!file) {
        file = localStorage.getItem(filename);
    }
    editor.setValue(file);            
});