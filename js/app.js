angular.module('AngularJSIndex', [])
	.controller('AngularJSIndexController', ['$scope', '$http', function($scope, $http) {
		//ESTA VARIABLE PERMITIRA LUEGO LLAMAR FUNCIONES POR MEDIO DE ABREVIACIONES
		//DENTRO DE OTRAS FUNCIONES.
		 var self = this;
         self.apiKey="5c75308024e56124bbe149c72c56dbdffc7f494d";
         self.format="json";
		 let myChart;

		 let LstIndicadores = ['DOLAR','EURO','IPC','UF','UTM'];

		 $scope.LstInd = LstIndicadores;

		
        // /*INICIO LISTADO DE VALORES*/
		 
		 self.ListadoValores = function(indicador){
            $scope.detValor = indicador;
            
			var url= "";
            
			var form_data ="apikey="+self.apiKey+"&formato="+self.format+"";
			

            url = returnURL(indicador);

			
			$http({
				method: 'GET',
				url: url,
				data: form_data,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function (response){
				//console.log(response.data);
				
				if (indicador=="DOLAR") {
					$scope.LstVal = response.data.Dolares;
				}else if (indicador=="EURO") {
					$scope.LstVal = response.data.Euros;
				}else if (indicador=="IPC") {
					$scope.LstVal = response.data.IPCs;
				}else if (indicador=="UF") {
					$scope.LstVal = response.data.UFs;
				}else if (indicador=="UTM") {
					$scope.LstVal = response.data.UTMs;
				}
				
			},function (error){
		
			});
		 }

		 $scope.LstVAL = self.ListadoValores;

         

		/*FIN LISTADO DE VALORES*/


		/*INICIO FUNCIONES NECESARIAS*/
		function sumarDias(fecha, dias){
            fecha.setDate(fecha.getDate() + dias);
            return fecha;
          }

		  function sumarYear(fecha, años){
            return fecha.getFullYear() + años;
        	}


		function returnURL(indicador){
			var form_data ="apikey="+self.apiKey+"&formato="+self.format+"";
			var fechaTermino = new Date();
				if (indicador == "IPC" || indicador == "UTM") {
					var fecha = new Date();
					var fechaInicio = sumarYear(fecha, -1);
					return 'https://api.cmfchile.cl/api-sbifv3/recursos_api/'+indicador.toLowerCase()+'/periodo/'+fechaInicio+'/'+(fecha.getMonth() + 1)+'/'+fechaTermino.getFullYear()+'/'+(fechaTermino.getMonth() + 1)+'?'+form_data;
					
				}else{
					var fecha = new Date();
					var fechaInicio = sumarDias(fecha, -30);
					return 'https://api.cmfchile.cl/api-sbifv3/recursos_api/'+indicador.toLowerCase()+'/periodo/'+fechaInicio.getFullYear()+'/'+(fechaInicio.getMonth() + 1)+'/dias_i/'+fechaInicio.getDate()+'/'+fechaTermino.getFullYear()+'/'+(fechaTermino.getMonth() + 1)+'/dias_f/'+fechaTermino.getDate()+'?'+form_data;
				}
		}
		/*FIN FUNCIONES NECESARIAS*/


		/*INICIO CARGADO DE GRAFICO*/
		self.cargarGrafico = function(indicador){
			$scope.detValor = indicador;
			var url= "";
            
			var form_data ="apikey="+self.apiKey+"&formato="+self.format+"";
			

            url = returnURL(indicador);
		 
		 	//console.log(url);

			
			$http({
				method: 'GET',
				url: url,
				data: form_data,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function (response){
				//console.log(response.data);
				
				if (indicador=="DOLAR") {
					response2 = response.data.Dolares;
				}else if (indicador=="EURO") {
					response2 = response.data.Euros;
				}else if (indicador=="IPC") {
					response2 =response.data.IPCs;
				}else if (indicador=="UF") {
					response2 =response.data.UFs;
				}else if (indicador=="UTM") {
					response2 =response.data.UTMs;
				}

				$scope.detVelorPrecio = response2[response2.length-1].Valor;
				$scope.detVelorFecha = response2[response2.length-1].Fecha;
				if ($scope.detValor == "IPC" || $scope.detValor == "UTM") {
				
				}else{
					response2 = response2.splice(12);
				}

				var Fechas  = [];
				var Valores = [];
			
				for(var i= 0; i < response2.length; i++) {

					Fechas.push(response2[i].Fecha);
					Valores.push(parseFloat(response2[i].Valor.replace('.', '').replace(',', '.')));

				
				}

				//console.log(Valores);

				const ctx = document.getElementById('myChart');
				if (self.myChart) {
					self.myChart.destroy();
				}

				self.myChart = new Chart(ctx, {
					type: 'bar',
					data: {
					labels: Fechas,
					datasets: [{
						label: 'Promedio de Valores',
						data: Valores.map(parseFloat),
						borderWidth: 1
					}]
					},
					options: {
					scales: {
						y: {
						beginAtZero: true
						}
					}
					}
				});
				
			},function (error){
		
			});
			
			
			
			
			

			
			
            
        }
		/*INICIO CARGADO DE GRAFICO*/
       

	

	}]);
