describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      username: 'juki',
      name: 'Junailija J.',
      password: 'pasander'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login from is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('juki')
      cy.get('#password').type('pasander')
      cy.get('#login-button').click()

      cy.contains('Junailija J. logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('juki')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'juki', password: 'pasander' })
      })

      it('A blog can be created', function() {
        cy.get('#show-blogform').click()
        cy.get('#title').type('First class tests')
        cy.get('#author').type('Robert C. Martin')
        cy.get('#url').type('http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html')
        cy.get('#create-button').click()

        cy.get('.notification')
          .should('contain', 'a new blog First class tests by Robert C. Martin added')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')

        cy.get('.blog-content')
          .should('contain', 'First class tests')
      })

      describe('And a blog exists', function() {
        beforeEach(function() {
          cy.createBlog({
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html'
          })
        })

        it('It can be liked', function() {
          cy.showBlog('First class tests')
          cy.get('@blog')
            .find('.likes > button')
            .click()
          cy.get('@blog')
            .find('.likes')
            .should('contain', '1')
        })

        it('It can be removed by creator', function() {
          cy.showBlog('First class tests')
          cy.get('@blog')
            .find('.remove-button')
            .click()
          cy.get('.blog-content')
            .should('not.contain', 'First class tests')
        })

        it('It can not be removed by non-creator', function() {
          const user = {
            username: 'pate',
            name: 'Postimies P.',
            password: 'pasander'
          }
          cy.request('POST', 'http://localhost:3001/api/users', user)

          cy.login({ username: 'pate', password: 'pasander' })

          cy.showBlog('First class tests')
          cy.get('@blog')
            .find('.remove-button')
            .should('not.be.visible')
        })

        describe('And multiple blogs exists', function() {
          beforeEach(function() {
            cy.createBlog({
              title: 'title 2',
              author: 'author 2',
              url: 'http://',
              likes: 2
            })
            cy.createBlog({
              title: 'title 3',
              author: 'author 3',
              url: 'http://',
              likes: 111
            })
            cy.createBlog({
              title: 'title 4',
              author: 'author 4',
              url: 'http://',
              likes: 12
            })
          })

          it('Blogs are ordered by likes', function() {
            cy.get('.blog-content')
              .find('.visibility-button')
              .each((button) => {
                cy.wrap(button).click()
              })

            const expectedLikes = ['111', '12', '2', '0']
            cy.get('.blog-content')
              .find('.likes>span')
              .each((like, index) => {
                cy.wrap(like).should(span => {
                  expect(span).to.have.text(expectedLikes[index])
                })
              })

          })
        })
      })
    })
  })
})
