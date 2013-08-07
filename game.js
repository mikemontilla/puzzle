//Función hecha para desorganizar un vector de cualquier tamaño
function Random(array)
{
	var length = array.length; //Se obtiene el tamaño del vector
	var aux; //Variable auxiliar que permite el intercambio entre valores internos del vector
	var randomPos; //variable que guarda el número aleatorio generado
	//	Se recorre todo el vector
	for(var i=0;i<length;i++)
	{
		aux = array[i]; //Se almacena el valor del vector en la posición actual i
		randomPos = Math.floor(Math.random() * length); //Se genera un número aleatorio entre 0 y el tamaño - 1
		array[i] = array[randomPos]; //Se coloca el valor del vector en la posición random como valor del vector en la posición actual
		array[randomPos] = aux; //Se coloca el valor del vector en la posición actual como valor del vector en la posición random
	}
	return array; //Se devuelve un vector con orden diferente al inicial
}
var Piece = function(value,rigthPosX,rigthPosY,posX,posY)
{
	this.value = value; //Valor numérico de la ficha
	this.isRigthPosition = false; //Variable que indica si la ficha se encuentra en la posición correcta
	this.posX = posX; //Variable que indica la fila actual en la que se encuentra la ficha (tablero 4x4)
	this.posY = posY; //Variable que indica la columna actual en la que se encuentra la ficha (tablero 4x4)
	this.rigthPosX = rigthPosX; //Variable que indica la fila en la que debería esta la ficha para estar en la posición correcta
	this.rigthPosY = rigthPosY; //Variable que indica la columna en la que debería esta la ficha para estar en la posición correcta
}
var Game = function()
{
	this.isWrongCount = 0; //Cuenta el número de fichas que se encuentran actualmente en la posición incorrecta
	this.piecesArray = new Array(); //Vector que contiene las 15 fichas y el espacio (simulado como otra ficha)

	//Este método permite hacer las configuraciones iniciales del juego. Ejemplo: repartir las fichas aleatoriamente.
	this.initializeGame = function()
	{
		var randomArray = new Array(); //Variable local que ayuda a generar el orden aleatorio de la posición de las fichas
		//Este for ayuda a llenar el vector con números del 1 al 15 (ordenadamente) 
		for(var i=0;i<15;i++)
			randomArray[i] = i+1;
		//	Se usa este do-while para desorganizar el vector randomArray hasta que el nuevo "orden" represente una solución
		//	para el juego. El método (función) que nos ayuda a esto es la llamada isSolvable.
		do
		{
			randomArray = Random(randomArray); //Se almacena en la misma variable el vector con un nuevo orden aleatorio
		}
		while(!this.isSolvable(randomArray)); //Se verifica si representa un juego solucionable

		//	Este ciclo se usa para recorrer el vector de fichas y crear una nueva ficha en las 
		//	primeras 15 posiciones del vector			
		for(var i=0;i<15;i++)
		{
			//	Se inicializa una ficha en cada posición del vector. Su valor con (i+1) para representar los números
			//	del 1 al 15, su posición correcta usando los valores de i (que está iterando en orden) y las operaciones
			//	de división y módulo; y su posición inicial en el juego usando los valores del vector randomArray y nuevamente
			//	las operaciones de división y módulo. 
			this.piecesArray[i] = new Piece(i+1,Math.floor(i/4+1),(i%4)+1,Math.floor((randomArray[i]-1)/4)+1,((randomArray[i]-1)%4)+1);

			//Con este condicional se comprueba si la ficha en su posición incial concidencialmente quedó en la posición correcta
			if((this.piecesArray[i].posX != this.piecesArray[i].rigthPosX) || (this.piecesArray[i].posY != this.piecesArray[i].rigthPosY))
				this.isWrongCount++; //Se le suma 1 a la cuenta de fichas en la posición incorrecta
			else
				this.piecesArray[i].isRigthPosition = true; //Simplemente se coloca la variable isRigthPosition de esa ficha en true
		}
		//Finalmente se inicializa el espacio en blanco con valor de ficha 16 y posición inicial y correcta (4,4)
		this.piecesArray[15] = new Piece(16,4,4,4,4); 			
	}

	//Esta función nos ayuda a verificar si la distribución del vector aleatorio representa un juego con solución
	this.isSolvable = function(random_array)
	{
		var control_sum = 0; //Se inicializa la variable suma en 0

		//	El vector de control nos ayuda a almacenar la cantidad de números menores que se encuentran a la derecha del
		//	número que se esta examinando. Así, control_array[i] almacena la cantidad de números menores a la derecha de
		// 	test_array[i].
		var control_array = new Array();  
		//	En este vector (test_array) quedan finalmente, organizados de izquierda a derecha y de arriba a abajo, 
		//	los números del tablero del juego.
		var test_array = new Array();
		//	En esta variable se almacena el tamaño del 
		//	vector (que es el mismo para cualquiera de los otros vectores)
		var length = random_array.length; 
		//Este primer ciclo sirve para ubicar los números en test_array de acuerdo a la distribución aleatoria
		for(var i=0;i<length;i++) 
			test_array[random_array[i]-1] = i+1;
		//Este ciclo inicializa todas las posiciones del vector de control en 0
		for(var i=0;i<length;i++)
			control_array[i] = 0;
		//En este ciclo se cuenta la cantidad de números menores a la derecha de test_array[i] y se suman en control_array[i]
		for(var i=0;i<length;i++)
		{
			for(var j=i+1;j<length;j++)
			{
				if(test_array[j]<test_array[i])
					control_array[i]++;
			}
			control_sum += control_array[i]; //Se realiza una suma de todas las posiciones de control_array
		}	

		//Si la suma es par, el juego tiene solución; si no, no tiene solución.	
		if(control_sum % 2 == 0)
			return true;
		else
			return false;
	}

	//Esta función es la que dibuja el tablero de juego en html
	this.drawBoard = function(pixel_size)
	{
		//Se le agrega a la etiqueta body un tablero de tamaño pixel_size que esta formado por dos divs anidados
		//la proporción entre los divs esta especificada en el archivo .css usando los ids agregados aquí.
		$("body").append('<section id="game_board" style="height:'+pixel_size+'px;width:'+pixel_size+'px;"><section id="piece_container"></section></section>');
		//	Por medio de este ciclo se adicionan las fichas ubicadas segun su posición inicial en filas y en columnas.
		//Se usan porcentajes para ubicarlas a 0, 25, 50 y 75% del borde del tablero. Cada ficha mide el 25% del tablero (archivo .css)
		for(var i=0;i<15;i++)
			$("#piece_container").append('<div class="game_piece" style="top:'+((this.piecesArray[i].posX-1)*25)+'%;left:'+((this.piecesArray[i].posY-1)*25)+'%"><div class="number_container">'+this.piecesArray[i].value+'</div></div>');		
	}

	//	Este método verifica si una ficha se encuentra en su posición correcta y modifica la cuenta de fichas 
	//	en la posición incorrecta
	this.checkPosition = function(piece)
	{
		//Mira si la posición actual de la ficha coincide con la posición correcta de la misma
		if((piece.posX == piece.rigthPosX) && (piece.posY == piece.rigthPosY)) 
		{
			piece.isRigthPosition = true; // Actualiza el valor de posición correcta de esa ficha
			this.isWrongCount--; // Le resta uno a la cuenta de fichas en la posición incorrecta
		}
		else
		{
			if(piece.isRigthPosition) //Mira cuál era el estado de posición correcta anterior de la ficha.
			{
				//Si entra a este if quiere decir que la ficha se movió de una posición incorrecta a una correcta
				piece.isRigthPosition = false;// Actualiza el valor de posición correcta de esa ficha
				this.isWrongCount++;// Le suma a la cuenta de fichas en la posición incorrecta
			}
		}
	}


	//Este método representa el movimiento de una ficha al espacio en blanco
	this.movePiece = function(piece_number)
	{
		//Se hace una resta entre la posición en fila de la ficha y la del espacio en blanco
		var test_posX = this.piecesArray[piece_number-1].posX - this.piecesArray[15].posX;
		//Se hace una resta entre la posición en columna de la ficha y la del espacio en blanco
		var test_posY = this.piecesArray[piece_number-1].posY - this.piecesArray[15].posY;
		var wasMoved = false; //Se inicializa la variable que se va a retornar
		if(Math.abs(test_posX) + Math.abs(test_posY) == 1) //Se verifica que la suma de los valores absolutos sea igual a 1
		{
			var auxX = this.piecesArray[piece_number-1].posX; //Se almacena momentaneamente la fila de la ficha
			var auxY = this.piecesArray[piece_number-1].posY; //Se almacena momentaneamente la columna de la ficha
			//Se asigna el valor de fila de el espacio en blanco que siempre está en la última posición del vector de fichas
			this.piecesArray[piece_number-1].posX = this.piecesArray[15].posX; 
			//Se asigna el valor de columna de el espacio en blanco que siempre está en la última posición del vector de fichas
			this.piecesArray[piece_number-1].posY = this.piecesArray[15].posY;
			this.piecesArray[15].posX = auxX; //Al espacio en blanco se le asigna el valor en fila que tenía antes la ficha
			this.piecesArray[15].posY = auxY; //Al espacio en blanco se le asigna el valor en columna que tenía antes la ficha
			this.checkPosition(this.piecesArray[piece_number-1]); //Se verifica la ´nueva posición de la ficha
			wasMoved = true; //Se modifica a true el valor de la variable a retornar
		}
		return wasMoved; //Se retorna la variable que indica si se realizó o no movimiento
	}

	//	Método que verifica si el juego ya se solucionó
	this.checkGame = function()
	{
		if(this.isWrongCount == 0) //Se verifica el número de fichas en la posición incorrecta
			return true; //Hay 0 fichas en la posición incorrecta
		else
			return false; //Hay alguna ficha en la posición incorrecta
	}
}

$(document).ready(function(){
	var game = new Game();
	game.initializeGame();
	game.drawBoard(500);
	$(".game_piece").click(function(){	
		var piece_number = $(this).children().text();	
		if(game.movePiece(piece_number))
			$(this).animate({'top':((game.piecesArray[piece_number-1].posX-1)*25)+'%','left':((game.piecesArray[piece_number-1].posY-1)*25)+'%'},500);
		if(game.checkGame())
			$("#talking_box").text("Has resuelto el juego");		
	});	
});
