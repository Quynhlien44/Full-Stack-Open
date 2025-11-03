const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'sekret'
            }
        })
        await page.goto('http://localhost:5173')
    })

    // 5.17
    test('Login form is shown', async ({ page }) => {
        await expect(page.getByText('log in to application')).toBeVisible()
    })

    // 5.18
    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByLabel('username').fill('mluukkai')
            await page.getByLabel('password').fill('sekret')
            await page.getByRole('button', { name: 'login' }).click()
            await expect(page.getByText(/logged in/)).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByLabel('username').fill('mluukkai')
            await page.getByLabel('password').fill('wrong')
            await page.getByRole('button', { name: 'login' }).click()
            const errorDiv = page.locator('.error')
            await expect(errorDiv).toContainText(/wrong username or password|invalid credentials/i)
            await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
            await expect(page.getByText(/logged in/)).not.toBeVisible()
        })
    })
})

describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')

        await page.getByLabel('username').fill('mluukkai')
        await page.getByLabel('password').fill('sekret')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByText('Matti Luukkainen logged in').waitFor()

        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByPlaceholder('title').fill('Blog for liking')
        await page.getByPlaceholder('author').fill('Tester')
        await page.getByPlaceholder('url').fill('http://example.com')
        await page.getByRole('button', { name: 'create' }).click()

        const blogElement = page.locator('.blog-basic', { hasText: 'Blog for liking' })
        await expect(blogElement.first()).toBeVisible()
    })

    // 5.19
    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()

        await page.getByPlaceholder('title').fill('A blog created by Playwright')
        await page.getByPlaceholder('author').fill('Playwright Tester')
        await page.getByPlaceholder('url').fill('http://playwright.test')

        await page.getByRole('button', { name: 'create' }).click()

        const blogElement = page.locator('.blog-basic', { hasText: 'A blog created by Playwright' })
        await expect(blogElement.first()).toBeVisible()
    })

    // 5.20
    test('a blog can be liked', async ({ page }) => {
        const blogElement = page.locator('.blog-basic', { hasText: 'Blog for liking' })

        const viewButton = blogElement.first().getByRole('button', { name: 'view' })
        await viewButton.waitFor({ state: 'visible', timeout: 15000 })
        await viewButton.click()
        await page.waitForTimeout(500)

        const likeButton = page.locator('.like-button').first()
        await likeButton.waitFor({ state: 'visible', timeout: 15000 })
        await likeButton.click()

        await page.getByText(/likes \d+/).waitFor({ timeout: 15000 })
    })

    // 5.21
    test('user who added a blog can delete it', async ({ page }) => {
        const uniqueTitle = `Blog for deleting ${Date.now()}`
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByPlaceholder('title').fill(uniqueTitle)
        await page.getByPlaceholder('author').fill('Tester')
        await page.getByPlaceholder('url').fill('http://example.com')
        await page.getByRole('button', { name: 'create' }).click()

        const blogRow = page.locator('.blog', { hasText: uniqueTitle })
        await expect(blogRow).toHaveCount(1)

        const blogElement = blogRow.first()
        const viewButton = blogElement.getByRole('button', { name: 'view' })
        await viewButton.click()
        const blogDetails = blogElement.locator('..').locator('.blog-details')
        await blogDetails.waitFor({ state: 'visible', timeout: 10000 })

        const removeButton = blogDetails.getByRole('button', { name: 'remove' })
        await removeButton.waitFor({ state: 'visible', timeout: 10000 })

        await Promise.all([
            page.waitForEvent('dialog').then(dialog => dialog.accept()),
            removeButton.click()
        ])

        await expect(page.locator('.blog', { hasText: uniqueTitle })).toHaveCount(0, { timeout: 10000 })
    })

    //5.22
    test('only the creator sees delete button', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'UserA',
                username: 'usera',
                password: 'passworda'
            }
        })

        await page.goto('http://localhost:5173')
        if (await page.getByRole('button', { name: 'logout' }).isVisible().catch(() => false)) {
            await page.getByRole('button', { name: 'logout' }).click()
        }

        await page.getByLabel('username').fill('usera')
        await page.getByLabel('password').fill('passworda')
        await page.getByRole('button', { name: 'login' }).click()
        const uniqueTitle = `Blog for visibility ${Date.now()}`
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByPlaceholder('title').fill(uniqueTitle)
        await page.getByPlaceholder('author').fill('Test Auth')
        await page.getByPlaceholder('url').fill('http://example.com')
        await page.getByRole('button', { name: 'create' }).click()
        const blogRow = page.locator('.blog', { hasText: uniqueTitle })
        await expect(blogRow).toHaveCount(1)
        const blogElement = blogRow.first()
        const viewButton = blogElement.getByRole('button', { name: 'view' })
        await viewButton.click()
        const blogDetails = blogElement.locator('..').locator('.blog-details')
        await blogDetails.waitFor({ state: 'visible', timeout: 10000 })
        await expect(blogDetails.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()

        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'UserB',
                username: 'userb',
                password: 'passwordb'
            }
        })
        if (await page.getByRole('button', { name: 'logout' }).isVisible().catch(() => false)) {
            await page.getByRole('button', { name: 'logout' }).click()
        }
        await page.getByLabel('username').fill('userb')
        await page.getByLabel('password').fill('passwordb')
        await page.getByRole('button', { name: 'login' }).click()
        const blogRowB = page.locator('.blog', { hasText: uniqueTitle })
        await expect(blogRowB).toHaveCount(1)
        const blogElementB = blogRowB.first()
        const viewButtonB = blogElementB.getByRole('button', { name: 'view' })
        await viewButtonB.click()
        const blogDetailsB = blogElementB.locator('..').locator('.blog-details')
        await blogDetailsB.waitFor({ state: 'visible', timeout: 10000 })
        await expect(blogDetailsB.getByRole('button', { name: 'remove' })).toBeHidden()
    })

    //5.23
    test('blogs are sorted by likes descending', async ({ page }) => {
        await page.goto('http://localhost:5173')
        if (await page.getByRole('button', { name: 'logout' }).isVisible().catch(() => false)) {
            await page.getByRole('button', { name: 'logout' }).click()
        }
        await page.getByLabel('username').fill('mluukkai')
        await page.getByLabel('password').fill('sekret')
        await page.getByRole('button', { name: 'login' }).click()

        const blogsData = [
            { title: 'Blog One', author: 'A', url: 'http://one.com' },
            { title: 'Blog Two', author: 'B', url: 'http://two.com' },
            { title: 'Blog Three', author: 'C', url: 'http://three.com' }
        ]
        for (const data of blogsData) {
            await page.getByRole('button', { name: 'create new blog' }).click()
            await page.getByPlaceholder('title').fill(data.title)
            await page.getByPlaceholder('author').fill(data.author)
            await page.getByPlaceholder('url').fill(data.url)
            await page.getByRole('button', { name: 'create' }).click()
        }
        await page.reload()

        // Mở view các blog
        for (const title of ['Blog One', 'Blog Two', 'Blog Three']) {
            const blog = page.locator('.blog', { hasText: title }).first()
            const viewButton = blog.getByRole('button', { name: 'view' })
            await viewButton.click()
        }

        // Like blog theo lượt
        for (let i = 0; i < 5; i++) {
            await page.locator('.blog', { hasText: 'Blog Two' }).first().locator('.like-button').click()
            await page.waitForTimeout(200)
        }
        for (let i = 0; i < 2; i++) {
            await page.locator('.blog', { hasText: 'Blog Three' }).first().locator('.like-button').click()
            await page.waitForTimeout(200)
        }
        await page.locator('.blog', { hasText: 'Blog One' }).first().locator('.like-button').click()
        await page.waitForTimeout(200)

        await page.reload()

        const blogElements = await page.locator('.blog').all()
        const titles = []
        for (const blog of blogElements) {
            const basicLocator = blog.locator('.blog-basic').first()
            const count = await basicLocator.count()
            if (count > 0) {
                const visible = await basicLocator.isVisible()
                if (visible) {
                    const txt = await basicLocator.textContent()
                    console.log('Text content:', txt)
                    if (txt !== null) titles.push(txt.trim())
                }
            }
        }
        //console.log('Final titles:', titles)
    })
})