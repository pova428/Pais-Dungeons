export const regions = [
    {
      id:"institute", index:"I", name:"Instituto Camí de Mar", short:"CAMÍ DE MAR", atmosphere:"Las clases han terminado. La pesadilla acaba de empezar.",
      description:"Los pasillos del instituto están vacíos, pero las aulas siguen encendidas. Algo se mueve detrás de las puertas de las clases.",
      boss:"Redes", bossRole:"SALA DEL JEFE",
      bossDescription:"El último aula del instituto. Los cables se retuercen por las paredes y el equipo de red sigue funcionando aunque el edificio esté desierto.",
      sites:[
        {id:"institute-programming",name:"Programacion",kind:"AULA",description:"Las pantallas siguen mostrando líneas de código que nadie recuerda haber escrito. Cada ordenador parece estar esperando una orden.",icon:"Ⅰ"},
        {id:"institute-database",name:"Base de Datos",kind:"AULA",description:"En el aula hay archivadores abiertos y servidores que zumban detrás de una puerta cerrada. Los registros no dejan de cambiar.",icon:"Ⅱ"},
        {id:"institute-yard",name:"Patio",kind:"EXTERIOR",description:"El patio está cubierto por una niebla espesa. Las puertas de acceso se han cerrado y se oyen pasos al otro lado de la pista.",icon:"Ⅲ"},
        {id:"institute-networks",name:"Redes",kind:"JEFE FINAL",description:"La sala final del instituto. Una maraña de cables, armarios de comunicaciones y luces rojas protege el camino de salida.",icon:"Ⅳ",boss:true}
      ]
    },
    {
      id:"baix-penedes", index:"II", name:"Baix Penedes", short:"BAIX PENEDES", atmosphere:"Carreteras conocidas que ya no llevan a casa.",
      description:"Una comarca convertida en territorio hostil. Los lugares cotidianos han quedado aislados y la carretera parece no terminar nunca.",
      boss:"Sushi", bossRole:"SALA DEL JEFE",
      bossDescription:"La sala final de Baix Penedes. Tras la última puerta espera el encuentro que cierra esta zona y guarda el paso hacia Steam.",
      sites:[
        {id:"baix-bowling",name:"Bolera",kind:"LOCAL DE OCIO",description:"Las pistas siguen encendidas y los bolos caen sin que nadie lance la bola. Algo espera al fondo del local.",icon:"Ⅰ"},
        {id:"baix-n340",name:"N-340",kind:"CARRETERA",description:"Una carretera bloqueada por vehículos abandonados. Las señales apuntan a destinos que ya no existen.",icon:"Ⅱ"},
        {id:"baix-cinema",name:"Cine",kind:"EDIFICIO",description:"La sesión lleva horas empezada. En la pantalla se proyectan imágenes de la propia compañía caminando por el edificio.",icon:"Ⅲ"},
        {id:"baix-sushi",name:"Sushi",kind:"JEFE FINAL",description:"La última sala de Baix Penedes. El local parece tranquilo desde fuera, pero la puerta no se abre desde dentro.",icon:"Ⅳ",boss:true}
      ]
    },
    {
      id:"steam", index:"III", name:"Steam", short:"STEAM", atmosphere:"Las partidas no terminan cuando abandonas el ordenador.",
      description:"Un territorio formado por mundos de terror que se han mezclado entre sí. Cada puerta lleva a una experiencia distinta y ninguna permite salir fácilmente.",
      boss:"Clubes", bossRole:"SALA DEL JEFE",
      bossDescription:"El último lugar de Steam. La compañía tendrá que superar el desafío final para cerrar esta parte de la maldición.",
      sites:[
        {id:"steam-content-warning",name:"Content warning",kind:"MUNDO DE TERROR",description:"Una expedición con cámara en mano. Hay que grabar lo que acecha en las sombras, aunque algo también esté grabando al grupo.",icon:"Ⅰ"},
        {id:"steam-labyrinthine",name:"Labyrinthine",kind:"LABERINTO",description:"Un laberinto de pasillos cambiantes. Las marcas en las paredes no siempre conducen al mismo sitio.",icon:"Ⅱ"},
        {id:"steam-backrooms",name:"Escape Backrooms",kind:"ZONA LIMINAL",description:"Habitaciones amarillentas, luces que zumban y corredores que se repiten. El camino de vuelta parece haberse borrado.",icon:"Ⅲ"},
        {id:"steam-clubs",name:"Clubes",kind:"JEFE FINAL",description:"La última sala de Steam. Las luces, el ruido y las sombras anuncian el desafío que cierra la tercera ruta.",icon:"Ⅳ",boss:true}
      ]
    }
  ];
