javascript:
	ct_url='http://www.junyent.org/blog/wp_commentracker.php';
if(typeof jQuery != 'function'){
	var q=document.createElement('script');
		q.setAttribute('id', 'jq');
		q.setAttribute('type', 'text/javascript');
		q.setAttribute('src', 'http://code.jquery.com/jquery-latest.pack.js');
		document.getElementsByTagName('head')[0].appendChild(q);
}
	var qi=document.createElement('script');
		qi.setAttribute('id', 'wpct_jqi');
		qi.setAttribute('type', 'text/javascript');
		qi.setAttribute('src', 'http://trentrichardson.com/Impromptu/scripts/jquery-impromptu.1.4.js');
		document.getElementsByTagName('head')[0].appendChild(qi);    

	void(z=document.body.appendChild(document.createElement('script')));
	void(z.type='text/javascript');
	void(z.src=ct_url+'?mode=js');
	void(z.id='commentracker');