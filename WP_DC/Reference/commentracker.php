<?php
/*
Template Name: Commentracker
*/
/*

CommenTracker - Sergio Álvarez (xergio)
mail@xergio.net
http://xergio.net
Licencia CC (BY-SA)

*/
/************************** PASOS PARA USAR EL SISTEMA *************************************************

0. Antes de nada, cualquier duda consultarla en mi web, en el tema siguiente:
    http://xergio.net/escrito-292/comentarios-cruzados.html
    
    O en el email que sale arriba.
    

1. Crear la siguiente tabla en la base de datos MySQL

CREATE TABLE commentracker (
    id_ct int(10) unsigned NOT NULL auto_increment,
    title varchar(255) NOT NULL default '',
    url varchar(255) NOT NULL default '',
    text text NOT NULL,
    date int(10) unsigned NOT NULL default '0',
    favicon varchar(100) NOT NULL default '',
    PRIMARY KEY  (id_ct)
);

2. Subir el archivo .php a tu espacio web
3. Crear un marcador/bookmarklet/favorito en tu Firefox (si no usas Firefox 
    mira a ver cómo funciona tu navegador) con el siguiente Location/dirección:
    
    javascript:ct_url='http://junyent.org/commentracker.php'; ct_pass='joan'; void(z=document.body.appendChild(document.createElement('script'))); void(z.type='text/javascript'); void(z.src=ct_url+'?mode=js'); void(z.id='commentracker');
    
    Si te fijas hay dos textos, uno es 'http://xergio.net/commentracker.php'
    y otro 'una_contraseña'. Esos dos textos tienes que editarlos, poniendo en
    uno la dirección de tu web, donde guardes el archivo .php, y es otro una
    contraseña o palabra secreta, la que tu quieras. Las comillas no las quites
    
4. Edita la líneas que hay un poco más abajo, antes del bloquede almoadillas (#)
    Son dos variables, en la primera tienes que poner la misma palabra secreta
    que usastes un poco más arriba.
    La segunda variable es para la conexión a MySQL, así que edita los campos
    que se indican: "localhost", "user", "pass_db", "db_name", que son
    respectivamente HOST de la DB, Usuario, Contraseña, y Nombre de la base de
    datos.

*/

$access = "joan";
$db = new mysql("mysql.junyent.org", "junyent", "78151970", "wpjunyent");

//##############################################################################
//##############################################################################
//##############################################################################

switch ($_GET["mode"]) {
    // Texto a  mostrar en modo Javascript. El comentario es la dirección para el
    // bookmark, javascript:void(...
    case "js":
?>
/*
Inspirado en from http://slayeroffice.com/tools/modi/v2.0/modi_help.html
Añade un TAG <script src="">... al documento HTML

javascript:
    ct_url='http://xergio.net/commentracker.php';
    ct_pass='lala';
    void(z=document.body.appendChild(document.createElement('script')));
    void(z.type='text/javascript');
    void(z.src=ct_url+'?mode=js');
    void(z.id='commentracker');
*/

function cm_init() {
    var cm_title = "";
    var cm_textarea = "";
    var cm_obj = null;
    
    // obtengo todos los tags...
    for (cm_i = 0; cm_i < document.getElementsByTagName("*").length; cm_i++) {
        cm_obj = document.getElementsByTagName("*")[cm_i];
        
        // guardamos el title, ya que normalmente ponen el título del artículo en
        // el <title>
        if (cm_obj.tagName.toLowerCase() == "title") {
            cm_title = cm_obj.innerHTML;
        }
    
        // el actual es un textarea?
        if (cm_obj.tagName.toLowerCase() == "textarea") {
            if (cm_obj.value.length > 0) // y hay algo escrito?
                if (cm_textarea.length == 0) // si no lo encontramos ya antes
                    // nos pregunta hasta que damos con el textarea bueno
                    if (confirm("¿Esto es lo que has escrito?\n\n" + cm_obj.value.slice(0, 200) + "..."))
                        cm_textarea = cm_obj.value;
        }
    }
    
    // si lo encontró no pregunta por el título
    if (cm_textarea.length > 0) {
        cm_title = prompt("Título de lo que has comentado:", cm_title);
        
        // todo OK? pues a guardarlo en nuestro DC
        if ((cm_title != null) && (cm_title != "")) {
            cm_ifrm = document.body.appendChild(document.createElement('iframe'));
            cm_ifrm.style.display = 'none';
            cm_ifrm.src = ct_url + '?mode=add&pass=' + encodeURIComponent(ct_pass) + '&url=' + encodeURIComponent(location.href) + "&title=" + encodeURIComponent(cm_title) + "&text=" + encodeURIComponent(cm_textarea);
            cm_ifrm.id = 'ifrmcommentracker';
//            alert(ct_url + '?mode=add&pass=' + encodeURIComponent(ct_pass) + '\n&url=' + encodeURIComponent(location.href) + "\n&title=" + encodeURIComponent(cm_title) + "\n&text=" + encodeURIComponent(cm_textarea));
        }
    }
}

cm_init();

<?php
        break;
        
    case "add":
        if ($_GET["pass"] == $access) {
            $db->query("INSERT INTO commentracker (id_ct, title, url, text, date, favicon) VALUES ('', '" . utf8_decode($_GET["title"]) . "', '" . utf8_decode($_GET["url"]) . "', '" . utf8_decode($_GET["text"]) . "', '" . time() . "', '" . getFavicon(utf8_decode($_GET["url"])) . "')");
            echo "<script type=\"text/javascript\">alert('Comentario guardado!!');</script>";
        } else {
            echo "<script type=\"text/javascript\">alert('No tienes acceso...');</script>";
        }
        break;
        
    default:        
?>

<?php get_header(); ?>

<div id="contenedor">

	<div id="content">

		<h1>Converses disperses</h1>
		<div id="commentracker">
    
			<?
			        $blogs = array();
			        $datas = $db->fetch("SELECT * FROM commentracker ORDER BY date DESC");
			        foreach ($datas as $data) {
			            $url = parse_url($data['url']);
			            $crl = $url['scheme'] . (($url['scheme'] == 'http') ? "://" : ".") . $url['host'];
			            $blogs[$crl]++;

			            echo "
			    <div class=\"ctitem\">
			        <h2" . (($data["favicon"]) ? " style=\"background: #fff url(" . $data["favicon"] . ") no-repeat center left; padding-left: 20px;\"": "") . "><a href=\"" . utf8_encode($data["url"]) . "\">" . utf8_encode($data["title"]) . "</a></h2>
			        <p>" . str_replace("\n", "<p />", utf8_encode($data["text"])) . "</p>
			        <span>Fecha: " . date("d/m/Y H:i", $data["date"]) . "</span>
			    </div>
			";
			        }

			?>
		</div>
		<div id="cocomments">
		<p>A continuació trobareu els comentaris recollits amb el sistema <a title="cocomment" href="http://www.cocomment.com">cocomment</a>. En principi no hi haurien  d'haver comentaris nous però ho conservo per si, per algun motiu, en algun moment no puc desar els comentaris mitjançant el sistema commentracker. 
		</p>
		<!-- START COCOMMENT.COM BOX -->
			<script type="text/javascript" src="http://www.cocomment.com/mybox-js/j_junyent/1"></script>
			<style type="text/css">
			  DIV.cocomment-box{ border:1px solid #DDDDDD; padding:2px; margin:1px;}
			  DIV.cocomment-box .boxhead{ background-color:#FFFFFF; text-align:center;}
			  DIV.cocomment-box .boxhead A{ color:#0D497B;}
			  DIV.cocomment-box .title{ padding:5px; margin-bottom:3px; background-color:white;}
			  DIV.cocomment-box .entry{ padding:5px; font-size:x-small; background-color:#DBE8FF;
			                            border-bottom: 1px dashed #CCCCCC;}
			  DIV.cocomment-box .author{ color:#0D497B;}
			  DIV.cocomment-box .author-alias { display:none;}
			  DIV.cocomment-box .service{ color:#0D497B;}
			  DIV.cocomment-box .comment{ color:black;}
			  DIV.cocomment-box A{ text-decoration:none;}
			  DIV.cocomment-box A:hover{ text-decoration:underline;}
			</style>
		<!-- END COCOMMENT.COM BOX -->
		</div>
				
	</div>

	<div id="menus">
			
			<div class="metadata">

					<h3><a title="Afegeix a del.icio.us" href="http://del.icio.us/post?url=<?php echo get_permalink(); ?>&title=<?php the_title(); ?>" target="blank"><img src="<?php bloginfo('stylesheet_directory'); ?>/images/deliciousicon.jpg" alt="Afegeix a del.icio.us"/></a> Sobre aquesta p&agrave;gina...</h3>
	                        <br />
							<p>Aquesta pàgina recull (quasi) tots els comentaris que vaig deixant per altres blogs.<br />
							Jo l'anomeno Converses disperses, però també rep els noms de conversess creuades, blog tranversal, Conversation tracker, etc...<br />
							Aquestes Converses disperses estan basades en el systema <a href="http://xergio.net/escrito-292/comentarios-cruzados.html" hreflang="es" title="Commentracker">Commentracker</a> de <a href="http://xergio.net" title="Sérgio Álvarez" hreflang="es">Sérgio Álvarez</a>. És una solució Javascript+PHP+MySQL que mitjançant un <em lang="en">bookmarklet</em> intercepta els comentaris just abans d'enviar-los i els còpia junt amb les dades bàsiques del que es comenta a una base de dades des d'on es poden cosultar a través d'aquesta pàgina.<br />
							Altres eines per a gestionar les converses disperses: tags de <a href="http://del.icio.us/" title="del.icio.us">del.icio.us</a> (o <a href="http://www.scuttle.org/" title="Scuttle">Scuttle</a> o <a href="http://sabros.us" title="sabros.us">sabros.us</a> per fer-ho de manera local), mini-blogs addicionals, <a href="http://www.cocomment.com/" title="coComment">coComment</a>, <a href="http://mycomments.idslab.com.ar/en/" title="myComments">myComments</a>, <a href="http://co.mments.com/" title="co.mments">co.mments</a>...<br />
							<br />
							Per indagar més en això de les Converses disperses, blog transversal, etc... :<br />
							Microsiervos: <a title="Microsiervos DC: Conversación Distribuida" href="http://www.microsiervos.com/archivo/weblogs/microsiervos-dc-conversacion-distribuida.html">Microsiervos DC: Conversación Distribuida</a><br />
							Tintachina: <a title="El blogger transversal" href="http://tintachina.com/archivo/el_blogger_transversal.php">El blogger transversal</a><br />
							Endocitosis de red, el blog de Albert Armengol: <a title="idea: feed de tus comentarios en la blogosfera" href="http://armengol.typepad.com/endocitosis/2004/11/idea_feed_de_tu.html">idea: feed de tus comentarios en la blogosfera</a><br />
							Anota: <a href="http://anota.ibit.org/aexternas.php" title="Anota - Anotaciones externas">Anota - Anotaciones externas</a><br />
							<br />
							Al wiki de <a href="http://www.microsiervos.com" hreflang="es" title="Microsiervos">Microsiervos</a> podreu trobar un llistat de blogs que recullen les seves <a href="http://wiki.microsiervos.com/Conversaciones_Distribuidas" hreflang="es" title="Microsiervos Wiki - Conversaciones Distribuidas">"Converses distribuïdes"</a>.
							</p>
							<?php edit_post_link('<strong>Editar esta entrada</strong>.','<p>','</p>'); ?>



					<h3>Pàgines en les que he dit la meva:</h3>
					    <ul>
							<?  // esto fue idea de Ander - http://phiz.ath.cx/~andres/blog/
					        arsort($blogs);
					        foreach ($blogs as $url => $num)
					            if (preg_match('/(https?:\/\/[a-zA-Z0-9\-\.]+)?/', $url, $match))
					                printf("<li><a href=\"%s\">%s</a> <span>(%d)</span></li>\n", utf8_encode($match[1]), utf8_encode($match[1]), utf8_encode($num));
							?>
					    </ul>
			</div>		
	                                                


			<?php get_sidebar(); ?>

	</div>

			<div class="clear"></div>
		
</div>

<?php get_footer(); ?>

<?php
        break;
}

//##############################################################################
//##############################################################################
//##############################################################################

class mysql {
    var $conexion;

    function mysql($host, $user, $pass, $name) {
        $this->conexion = @mysql_connect($host, $user, $pass) or die('[1] MySQL error: '.mysql_error());
        mysql_select_db($name, $this->conexion) or die('[2] MySQL error: '.mysql_error());
    }

    function __destruct() {
        //mysql_close($this->conexion);
        // No cierro la conexión porque me ha dado problemas. Tal y como dicen en
        // http://es2.php.net/manual/en/function.mysql-close.php, no hace falta
        // hacerlo en conexiones no persistentes, porque se cierran al terminar
        // la ejecución del script
    }

    function query($query) {
        /*$multiSQL = "/('[^']*'|\"[^\"]*\"|[^;'\"])*;/";
        preg_match_all($multiSQL, $query . ((substr($query, -1, 1) == ";") ? ";": ""), $aSQL);

        for ($i = sizeof($aSQL = $aSQL[0]); $i--;)
            if (!($trim = trim(substr($aSQL[$i], 0 , -1)))) unset ($aSQL[$i]);
            else $aSQL[$i] = $trim . ";";

        $rSQL = true;
        foreach ($aSQL as $i => $sql) {
            //printf("-- %s<br />", $sql);
            $rSQL = ((mysql_query($sql, $this->conexion)) ? $rSQL : false);
        }*/
        
        $rSQL = mysql_query($query, $this->conexion);

        return $rSQL;
    }

    function fetch($query, $tipo = MYSQL_BOTH) {
        $resultado = mysql_query($query);

        $fetch = array();
        while ($actual = mysql_fetch_array($resultado, $tipo))
            $fetch[] = $actual;

        mysql_free_result($resultado);
        
        return $fetch;
    }

    function last_id() {
        return mysql_insert_id($this->conexion);
    }
    
    
    
    function error() {
        return mysql_error();
    }
}

// http://www.peej.co.uk/projects/favatars.html modificado
function getFavicon($url) {
    $urlParts = parse_url($url);
    $HTTPRequest = fsockopen($urlParts["host"], 80);
    if ($HTTPRequest) {
        //stream_set_timeout($HTTPRequest, 0.1);
        $hd = "GET " . ((isset($urlParts['path'])) ? $urlParts['path'] : "/").((isset($urlParts['query'])) ? "?".$urlParts['query'] : "") . " HTTP/1.1\n";
        $hd .= "Host: " . $urlParts["host"] . "\n";
        $hd .= "User-Agent: xergioNET - Commentrack System v1\n";
        $hd .= "Connection: Close\n\n";
        fwrite($HTTPRequest, $hd);
        $html = fread($HTTPRequest, 4096);
        $HTTPRequestData = stream_get_meta_data($HTTPRequest);
        fclose($HTTPRequest);

        if (!$HTTPRequestData['timed_out']) {
            if (preg_match('/<link[^>]+rel="(?:shortcut )?icon"[^>]+?href="([^"]+?)"/si', $html, $matches)) {
                $linkUrl = html_entity_decode($matches[1]);
                
                if (substr($linkUrl, 0, 1) == '/') {
                    $faviconURL = $urlParts['scheme'].'://'.$urlParts['host'].$linkUrl;
                    
                } elseif (substr($linkUrl, 0, 7) == 'http://') {
                    $faviconURL = $linkUrl;

                } elseif (substr($url, -1, 1) == '/') {
                    $faviconURL = $url.$linkUrl;

                } else {
                    $faviconURL = $url.'/'.$linkUrl;
                }
                
            } else {
                $faviconURL = $urlParts['scheme'].'://'.$urlParts['host'].'/favicon.ico';
            }
            
            $fiUrlParts = parse_url($faviconURL);
            $HTTPRequest = fsockopen($fiUrlParts["host"], 80);
            if ($HTTPRequest) {
                //stream_set_timeout($HTTPRequest, 0.1);
                $hd = "GET " . ((isset($fiUrlParts['path'])) ? $fiUrlParts['path'] : "/").((isset($fiUrlParts['query'])) ? "?".$fiUrlParts['query'] : "") . " HTTP/1.1\n";
                $hd .= "Host: " . $fiUrlParts["host"] . "\n";
                $hd .= "User-Agent: xergioNET - Commentrack System v1\n";
                $hd .= "Connection: Close\n\n";
                fwrite($HTTPRequest, $hd);
                $favicon = fread($HTTPRequest, 4096);

                if (!preg_match("/^.* 404 Not Found/si", $favicon)) {
                    $HTTPRequestData = stream_get_meta_data($HTTPRequest);
                    fclose($HTTPRequest);
                    
                    if (!$HTTPRequestData['timed_out'] && strlen($favicon) < 4096) {
                        return $faviconURL;
                    }
                }
            }
        }
    }

    return false;
}

?>