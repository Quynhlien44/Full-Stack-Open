import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('Blog component', () => {
    const blog = {
        title: 'Test blog',
        author: 'Test author',
        url: 'http://test.com',
        likes: 10,
        user: {
            username: 'testuser',
            name: 'Test User',
            id: '123'
        }
    }

    const currentUser = { username: 'testuser', id: '123' }

    test('renders title and author but not url or likes by default', () => {
        render(<Blog blog={blog} currentUser={currentUser} onLike={() => { }} onRemove={() => { }} />)

        // Title and author visible
        expect(screen.getByText(/Test blog/)).toBeInTheDocument()
        expect(screen.getByText(/Test author/)).toBeInTheDocument()

        // URL and likes not visible by default
        expect(screen.queryByText('http://test.com')).toBeNull()
        expect(screen.queryByText(/likes 10/)).toBeNull()
    })

    test('url and likes are shown when view button is clicked', async () => {
        render(<Blog blog={blog} currentUser={currentUser} onLike={() => { }} onRemove={() => { }} />)
        const user = userEvent.setup()

        // Click "view" button to show details
        const button = screen.getByText('view')
        await user.click(button)

        // Check if URL and likes are now visible
        expect(screen.getByText('http://test.com')).toBeInTheDocument()
        expect(screen.getByText(/likes 10/)).toBeInTheDocument()
    })

    test('if like button is clicked twice, event handler is called twice', async () => {
        const mockHandler = vi.fn()

        render(<Blog blog={blog} currentUser={currentUser} onLike={mockHandler} onRemove={() => { }} />)
        const user = userEvent.setup()

        // Show details to see like button
        const viewButton = screen.getByText('view')
        await user.click(viewButton)

        // Click like button twice
        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})

describe('BlogForm component', () => {
    test('calls event handler with right details when form submitted', async () => {
        const createBlog = vi.fn()
        const user = userEvent.setup()
        render(<BlogForm createBlog={createBlog} />)

        const titleInput = screen.getByPlaceholderText('title')
        const authorInput = screen.getByPlaceholderText('author')
        const urlInput = screen.getByPlaceholderText('url')
        const sendButton = screen.getByText('create')

        await user.type(titleInput, 'Test Title')
        await user.type(authorInput, 'Test Author')
        await user.type(urlInput, 'http://test-url.com')

        await user.click(sendButton)

        expect(createBlog.mock.calls).toHaveLength(1)

        expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
        expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
        expect(createBlog.mock.calls[0][0].url).toBe('http://test-url.com')
    })
})