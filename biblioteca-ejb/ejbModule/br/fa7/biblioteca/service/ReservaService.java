package br.fa7.biblioteca.service;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import br.fa7.biblioteca.model.Aluno;

@Stateless
public class ReservaService {

	@PersistenceContext(unitName="biblioteca")
	private EntityManager em;
	
	@SuppressWarnings("unchecked")
	public List<Aluno> listar(){
		Query query = em.createQuery("SELECT a from Aluno a");
		return query.getResultList();
	}
}