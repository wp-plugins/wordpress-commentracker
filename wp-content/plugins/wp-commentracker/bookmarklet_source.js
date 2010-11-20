javascript:(function () {
  wpct_baseurl = 'http://junyent.org/blog';
  var s=document.createElement('script');
  s.src=wpct_baseurl + '/wp-content/plugins/wp-commentracker/wpct_script.js';
  s.type='text/javascript';
  document.body.appendChild(s);
  
  
 var e = document.createElement( "link" ); 
    e.rel = "stylesheet"; 
    e.type = "text/css"; 
    e.href = wpct_baseurl + '/wp-content/plugins/wp-commentracker/wpct_styles.css'; 
    document.getElementsByTagName( "head" )[0].appendChild( e ); 

})();


