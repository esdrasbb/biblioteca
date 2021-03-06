moduleBiblioteca
	.controller('livroController', function($scope, $rootScope, $http) {
		
		$rootScope.mensagemSucesso = "";
		$rootScope.mensagemErro = "";
		
		jQuery('#panelMensagemSucesso').hide();
		jQuery('#panelMensagemErro').hide();
		
		$scope.aluno = {id:1};
		$scope.livros = [];
		$scope.reservas = [];
		$scope.sugestoes = [];
		
		$http.get('api/livros').
	        then(function(response) {
	            $scope.livros = response.data;
	        },function(response) {
	            $rootScope.mensagemErro = "Erro ao consultar livros!";
	            jQuery('#panelMensagemErro').show();			            
	        });

		$http.get('api/reservas').
	        then(function(response) {
	            $scope.reservas = response.data;
	        },function(response) {
	            $rootScope.mensagemErro = "Erro ao consultar reservas!";
	            jQuery('#panelMensagemErro').show();			            
	        });

		$http.get('api/sugestao').
	        then(function(response) {
	            $scope.sugestoes = response.data;
	        },function(response) {
	            $rootScope.mensagemErro = "Erro ao consultar sugestões!";
	            jQuery('#panelMensagemErro').show();			            
	        });

		$scope.isReservado = function(livro){
			for(var i=0; i< $scope.reservas.length; i++) {
				var reserva = $scope.reservas[i];
				if(reserva.livro.id == livro.id){
					return true;
				}
			}
			return false;
		}

		$scope.isSugerido = function(livro){
			for(var i=0; i< $scope.sugestoes.length; i++) {
				var sugestao = $scope.sugestoes[i];
				if(sugestao.livro.id == livro.id){
					return true;
				}
			}
			return false;
		}

		$scope.enviarReservas = function(){
			$http.post('api/reservas',$scope.getReservasPendentes()).
				then(function(response) {
					console.log("Sucesso");
					$http.get('api/reservas').
				        then(function(response) {
				            $scope.reservas = response.data;
				            $rootScope.mensagemSucesso = "Reservas enviadas!";
				            jQuery('#panelMensagemSucesso').show();			            
				        });					
				}, function(response) {
		            $rootScope.mensagemErro = "Erro ao enviar reservas!";
		            jQuery('#panelMensagemErro').show();			            
				});
		}
		
		$scope.getReservasPendentes = function(){
			var reservas=[];
			for(var i=0; i< $scope.reservas.length; i++) {
				var reservaLivro = $scope.reservas[i];
				if(reservaLivro.id == null){
					reservas.push(reservaLivro);					
				}
	        }
			return reservas;
		}

		$scope.enviarSugestoes = function(){
			$http.post('api/sugestao',$scope.getSugestoesPendentes()).
				then(function(response) {
					$http.get('api/sugestao').
			        then(function(response) {
			            $scope.sugestoes = response.data;
			            $rootScope.mensagemSucesso = "Sugestões enviadas!";
			            jQuery('#panelMensagemSucesso').show();			            
			        });					
					}, function(response) {
			            $rootScope.mensagemErro = "Erro ao enviar sugestões!";
			            jQuery('#panelMensagemErro').show();			            
					});
		}

		$scope.getSugestoesPendentes = function(){
			var sugestoes=[];
			for(var i=0; i< $scope.sugestoes.length; i++) {
				var sugestaoLivro = $scope.sugestoes[i];
				if(sugestaoLivro.id == null){
					sugestoes.push(sugestaoLivro);					
				}
	        }
			return sugestoes;
		}

		$scope.sugerirLivro = function(livro){
			var sugestaoLivro = {};
			sugestaoLivro.livro=livro;
			sugestaoLivro.aluno=$scope.aluno;

			if($scope.sugestoes.indexOf(sugestaoLivro) == -1){
				$scope.sugestoes.push(sugestaoLivro);				
			}
		}
		
		$scope.reservarLivro = function(livro){
			var reservaLivro = {};
			reservaLivro.livro=livro;
			reservaLivro.aluno=$scope.aluno;

			if($scope.reservas.indexOf(reservaLivro) == -1){
				$scope.reservas.push(reservaLivro);				
			}
		} 

		$scope.isPodeRemoverReserva = function(reserva){
			return (reserva.situacaoReserva == null || reserva.situacaoReserva.id == null 
					|| reserva.situacaoReserva.id == 1 || reserva.situacaoReserva.id == 3)
		}

		$scope.removerReserva = function(reserva){
			if(!$scope.isPodeRemoverReserva(reserva)) return;
			if(reserva.id!=null){
				$http.delete('api/reservas/' + reserva.id).
					then(function(response) {
			            $rootScope.mensagemSucesso = "Reserva excluída!";
			            jQuery('#panelMensagemSucesso').show();	
					}, function(response) {
			            $rootScope.mensagemSucesso = "Erro ao excluir reserva!";
			            jQuery('#panelMensagemErro').show();	
					});				
			}
			var index = $scope.reservas.indexOf(reserva);
			if(index >= 0){
				$scope.reservas.splice(index,1);				
			}
		}
	
		$scope.isPodeRemoverSugestao = function(sugestao){
			return (sugestao.situacaoSugestao == null || sugestao.situacaoSugestao.id == null 
					|| sugestao.situacaoSugestao.id == 1 || sugestao.situacaoSugestao.id == 3)
		}

		$scope.removerSugestao = function(sugestao){
			if(!$scope.isPodeRemoverSugestao(sugestao)) return;
			if(sugestao.id!=null){
				$http.delete('api/sugestao/' + sugestao.id).
					then(function(response) {
			            $rootScope.mensagemSucesso = "Sugestão excluída!";
			            jQuery('#panelMensagemSucesso').show();	
					}, function(response) {
			            $rootScope.mensagemSucesso = "Erro ao excluir sugestão!";
			            jQuery('#panelMensagemErro').show();	
					});				
			}
			var index = $scope.sugestoes.indexOf(sugestao);
			if(index >= 0){
				$scope.sugestoes.splice(index,1);				
			}
		}
		
		$scope.cancelarSugestoes = function(){
			var copiaSugestoes = $scope.sugestoes.slice();
            for(var i=0; i< copiaSugestoes.length; i++) {
            	var sugestao = copiaSugestoes[i]; 
            	$scope.removerSugestao(sugestao);
            }
            $rootScope.mensagemSucesso = "Sugestões Canceladas!";
            jQuery('#panelMensagemSucesso').show();            
		}
		
		$rootScope.fecharMensagemSucesso = function(){
			jQuery('#panelMensagemSucesso').hide();
		}

		$rootScope.fecharMensagemErro = function(){
			jQuery('#panelMensagemErro').hide();
		}

		$scope.cancelarReservas = function(){
			var copiaReservas = $scope.reservas.slice();
            for(var i=0; i< copiaReservas.length; i++) {
            	var reserva = copiaReservas[i]; 
            	$scope.removerReserva(reserva);
            }
            $rootScope.mensagemSucesso = "Reservas Canceladas!";
            jQuery('#panelMensagemSucesso').show();
		}
		
		jQuery(document).ready(function(){
		    $('[data-toggle="tooltip"]').tooltip();   
		});
	});