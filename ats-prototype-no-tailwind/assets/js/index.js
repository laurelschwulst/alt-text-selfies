$(function(){

    // click menu, display collapsed menu
    // snippet: menu-collapsed

    $('#menu-activator a').click(function(){
        $('.collapsed').toggleClass('uncollapsed');
        $(this).toggle();
    });

    $('a.close').click(function(){
        $('.collapsed').toggleClass('uncollapsed');
        $('#menu-activator a').toggle();
    });

});