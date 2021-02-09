const { when } = require('jest-when')
const AuthManager = require('./manager')

const mockTokenStore = {
    get: jest.fn(),
    set: jest.fn(),
}

const mockClient = {
    authorizeURL: jest.fn(),
    createToken: jest.fn(),
    getToken: jest.fn(),
}

const manager = new AuthManager(mockClient, mockTokenStore)

describe('auth-manager', () => {
    test('loginUrl', () => {
        const url = 'http://oauth.com/login'
        const redirectUrl = 'http://localhost'
        mockClient.authorizeURL.mockReturnValue(url)
        expect(manager.getLoginUrl(redirectUrl)).toEqual(url)
        expect(mockClient.authorizeURL).toBeCalledWith({ redirect_uri: redirectUrl, response_type: 'code' })
    })

    test('processCode', async () => {
        const redirectUrl = 'http://localhost'
        const code = 'auth-123'
        const token = { access_token: '123' }
        when(mockClient.getToken)
            .calledWith({ code, redirect_uri: redirectUrl })
            .mockResolvedValue(token)
        await manager.processCode(code, redirectUrl)
        expect(mockTokenStore.set).toBeCalledWith(token)
    })

    describe('getAccessToken', () => {
        const tokenPOJO = { access_token: '123' }
        test('returns token from store', async () => {
            const token = createMockToken(tokenPOJO, false)
            mockTokenStore.get.mockResolvedValue(tokenPOJO)
            when(mockClient.createToken)
                .calledWith(tokenPOJO)
                .mockReturnValue(token)
            expect(await manager.getAccessToken()).toEqual('123')
        })

        test('refreshes an expired token before returning it', async () => {
            const token1 = createMockToken(tokenPOJO, true)
            const token2 = createMockToken({ access_token: '567' }, false)
            mockTokenStore.get.mockResolvedValue(tokenPOJO)
            when(mockClient.createToken)
                .calledWith(tokenPOJO)
                .mockReturnValue(token1)
            token1.refresh.mockResolvedValue(token2)

            expect(await manager.getAccessToken()).toEqual('567')
            expect(mockTokenStore.set).toBeCalledWith(token2)
        })
    })
})

function createMockToken (tokenJSON, expired) {
    return {
        toJSON: () => tokenJSON,
        expired: () => expired,
        refresh: jest.fn(),
    }
}