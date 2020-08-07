describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Cyress Test User',
      username: 'cyTestUser',
      password: 'cyTestPass'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Blog')
    cy.contains('login')
    cy.contains('Blogs:')
  })

  it('Login Button is shown', function () {
    cy.get('button').contains('login')
  })
  
  it('Login Form Appears on clicking Login Button', function () {
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
    cy.get('button').contains('login')
    cy.get('button').contains('cancel')
  })

  it('for correct user and password, login is successful', function () {
    cy.contains('login').click()
    cy.get('#Username').type('cyTestUser')
    cy.get('#Password').type('cyTestPass')
    cy.get('#login-submit').click()
    cy.contains('Cyress Test User logged in')
    cy.get('.Notification')
      .should('contain', 'cyTestUser Logged in')
      .and('have.css', 'color', 'rgb(0, 128, 0)')
      .and('have.css', 'border-style', 'solid')
    cy.get('button').contains('logout')
    cy.get('button').contains('New Blog')
  })

  it('for incorrect user and password, login is UNsuccessful', function () {
    cy.contains('login').click()
    cy.get('#Username').type('cyTestUser')
    cy.get('#Password').type('WrongCyTestPass')
    cy.get('#login-submit').click()
    cy.get('.Notification')
      .should('contain', 'invalid username or password')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')
    cy.get('html').should('not.contain', 'Cyress Test User logged in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      const user = {
        username: 'cyTestUser',
        password: 'cyTestPass'
      }
      cy.login(user)
    })
    it('a new blog can be created', function () {
      cy.contains('New Blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('authored by cypress')
      cy.get('#url').type('url by cypress')
      cy.contains('Submit').click()
      cy.contains('a blog created by cypress')
      cy.contains('authored by cypress')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another Cypress Blog',
          author: 'Cypress Test',
          url: 'test URL',
          likes: 12
        })
      })

      it('it can be expanded', function () {
        cy.get('.blogHide > button').click()
        cy.contains('Hide')
        cy.contains('likes')
        cy.contains('test URL')
        cy.contains('Cypress Test')
        cy.contains('Remove')
      })

      describe('and it is expanded', function () {
        beforeEach(function () {
          cy.get('.blogHide > button').click()
        })

        it('a like can be added', function () {
          cy.contains('Like').click()
          cy.get('.Notification')
            .should('contain', 'blog another Cypress Blog by Cypress Test has been liked')
            .and('have.css', 'color', 'rgb(0, 128, 0)')
            .and('have.css', 'border-style', 'solid')
        })
      })
    })

    describe('and several blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another Cypress Blog 1',
          author: 'Cypress Test',
          url: 'test URL',
          likes: 7
        })
        cy.createBlog({
          title: 'another Cypress Blog 2',
          author: 'Cypress Test',
          url: 'test URL',
          likes: 3
        })
        cy.createBlog({
          title: 'another Cypress Blog 3',
          author: 'Cypress Test',
          url: 'test URL',
          likes: 12
        })
      })

      it(' which are ordered from most liked at the top', function () {
        // const nBlogs = cy.get('.blogHide').its('length')
        // console.log(nBlogs)
        cy.get('.blogHide').then(($nav) => {
          for (var i = 0; i < 3; i++) {
            cy.get($nav[i]).find('button').click()
          }
        })

        cy.get('.numLikes').then(($numLikes) => {
          cy.get($numLikes).invoke('text').then(($vals) => {
            expect($vals).to.be.eq(' 12  7  3 ')
          })
        })
      })

      it('and Blog 2 can be liked', function () {
        cy.contains('another Cypress Blog 2').parent().find('button').as('theShowButton')
        cy.get('@theShowButton').click()
        cy.contains('another Cypress Blog 2').parent().find('button').contains('Like').as('theLikeButton')
        cy.get('@theLikeButton').click()
        cy.get('.numLikes').should('contain', '4')
      })
      it('and Blog 3 can be deleted', function () {
        cy.contains('another Cypress Blog 3').parent().find('button').as('theShowButton')
        cy.get('@theShowButton').click()
        cy.contains('another Cypress Blog 3').parent().find('button').contains('Remove').as('theRemoveButton')
        cy.get('@theRemoveButton').click()
        cy.get('.Notification')
          .should('contain', 'Blog another Cypress Blog 3 removed successfully')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')
        cy.get('html').should('contain', 'another Cypress Blog 1 Cypress Test')
        cy.get('html').should('contain', 'another Cypress Blog 2 Cypress Test')
        cy.get('html').should('not.contain', 'another Cypress Blog 3 Cypress Test')
      })

      describe('Another logged in user', function () {
        beforeEach(function() {
          const anotherUser = {
            name: 'Another Cyress Test User',
            username: 'AnothercyTestUser',
            password: 'AnothercyTestPass'
          }
          
          cy.get('#logoutButton').click()
          cy.addUser(anotherUser)
          cy.login(anotherUser)
        })

        it('can add like to Blog 1', function () {
          cy.contains('another Cypress Blog 2').parent().find('button').as('theShowButton')
          cy.get('@theShowButton').click()
          cy.contains('another Cypress Blog 2').parent().find('button').contains('Like').as('theLikeButton')
          cy.get('@theLikeButton').click()
          cy.get('.numLikes').should('contain', '4')
        })
        it('Can NOT see Remove button for Blog 2', function () {
          cy.contains('another Cypress Blog 2').parent().find('button').as('theShowButton')
          cy.get('@theShowButton').click()
          cy.contains('another Cypress Blog 2').parent().as('divToCheck')
          cy.get('@divToCheck').should('not.contain', 'Remove')
        })
      })
    })
  })
})