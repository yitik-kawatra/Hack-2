let data={};
$(function(){
    let interval;
    $('.second.input').val("");
    $('.image').show(200);
    $('.image').animate({right: '450px',width:'550px',height:'530px'},3000,function(){
        $('.arrow').show(200);
        $('.first.text').show(500);
        let t=0;
       interval=  setInterval(function() {
      
          if(t==4000){
              clearInterval(interval)
          }
          t+=1000;
            $('.arrow').slideDown('500', function() {
                $('.arrow').slideUp('500');
            });
       }, 1000);

    })

    $('.image').click(function(){
        clearInterval(interval)
        $('.first').animate({opacity:'0.2'},1000,function(){
        $('.first').css("display","none");
        $('.body').addClass('second-bg');
        $('.second.text').show(300);
        $('.second.input').show(700,function(){
            $('.second.input').css("border-width","10px")
        });
        $('.second.submit').show(400);
        $('.second.input').focus();
        })
    })
    
})
let filename="";
$('.second.submit').click(function(){
    filename=$('.second.input').val();
    $('.second').fadeOut(1500,function(){
        $('.second').css("display","none");
        $('#my_pdf_viewer').show(500);
        $('.container').show(500);
        $('.body').addClass('third-bg');
        $('.change').show(200);
    })
   
})
let  myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1.25
}

$('.second.submit').click(function(){
    if(filename==""){
        alert('Please enter correct filename');
        return;
    }
    
    pdfjsLib.getDocument('./pdf/'+filename+'.pdf').then((pdf) => {
        myState.pdf = pdf;
        render();
    
    });
})



let canvas;
let no=1;
function render() {
    myState.pdf.getPage(myState.currentPage).then((page) => {
  
          canvas = $("#pdf_renderer")[0];
        let ctx = canvas.getContext('2d');

        let viewport = page.getViewport(myState.zoom);

        canvas.width = viewport.width;
        canvas.height = viewport.height;
  
        page.render({
            canvasContext: ctx,
            viewport: viewport
        });
    });
   if(no==1){
       restored();
   }
   no++;
}
function restored(){
    $('.output').hide();
    let ctext="";
    let localdata=JSON.parse(localStorage.getItem('pdfs'));

    if(localdata[myState.pdf]){

        if(localdata[myState.pdf][myState.currentPage]){
            ctext=localdata[myState.pdf][myState.currentPage];
            $('.output').text("");
            $('.output').show();
            $('.output').text(ctext);
        }
    }
}

$('#go_previous').click( e => {
    if(myState.pdf == null || myState.currentPage == 1) 
      return;
    myState.currentPage -= 1;
    document.getElementById("current_page").value = myState.currentPage;
    render();
});

$('#go_next').click(e => {
    if(myState.pdf == null || myState.currentPage > myState.pdf._pdfInfo.numPages) 
       return;
    myState.currentPage += 1;
    document.getElementById("current_page").value = myState.currentPage;
    render();       
});
let fullQuality;

let cpdf;
let cpage;
$('#convert').click(function(){
    $('.output').hide();
    cpdf=myState.pdf;
    cpage=myState.currentPage;
    $('.output').text("");
    let loader=$('.loader')[0];
    fullQuality = canvas.toDataURL('image/jpeg', 1.0);
    $('.container').append(loader);
    $('.loader').css("display","block");
    Tesseract.recognize(
        fullQuality,
        'eng',
      //  { logger: m => console.log(m) }
      ).then(({ data: { text } }) => {
          $('.loader').css("display","none");
        $('.output').show(200);
        $('.output').text(text);
        $('.change').show(200)
      })
      
})
$('.change').click(function(){
    if($('.output').val()!=""){
       let obj={};
       obj[cpage]=$('.output').val();
        data[cpdf]=obj;
        localStorage.setItem('pdfs',JSON.stringify(data));
    }
})


$('#restore').click(restored);