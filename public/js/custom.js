//https://codepen.io/mobifreaks/pen/LIbca
function readURL(input) 
{
    
    if (input.files && input.files[0]) 
    {
        var reader = new FileReader();
        var file = input.files[0];
        reader.onload = function (e) {
            $('#image_id').attr('src', e.target.result);
            //if any current result, that would be no more valid (Warning: if u route error also via msg, this would be hidden)
            $('#result_id').hide(); 
        };
        reader.readAsDataURL(file);        
    }
}

//save image file before form submit to not lose it
//thanks: https://stackoverflow.com/questions/17591447/how-to-reload-current-page-without-losing-any-form-data
window.onbeforeunload = function() 
{
    sessionStorage.setItem("uploadedfileAttr", $('#image_id').attr('src'));
    $('#image_id').hide(); $('#result_id').hide();     
    $('#loader').show(); 
}
//restore and display image file after page reload
window.onload = function() 
{
    $('#image_id').hide(); $('#result_id').hide(); 
    var uploadedfileAttr = sessionStorage.getItem("uploadedfileAttr");
    if (uploadedfileAttr != null) 
    {
        $('#image_id').attr('src', uploadedfileAttr);
    }
    else
    {
        //src="http://placehold.it/300" 
        $('#image_id').attr('src', "http://placehold.it/300");
    }
    $('#loader').hide(); 
    $('#result_id').show(); $('#image_id').show();         
}
