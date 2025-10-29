import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
    credentials: 'include'
  }),
  tagTypes: ['Product', 'Order', 'Review'],
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation({
      query: (body: { name: string; email: string; password: string }) => ({
        url: '/api/auth/register',
        method: 'POST',
        body
      })
    }),
    login: builder.mutation({
      query: (body: { email: string; password: string }) => ({
        url: '/api/auth/login',
        method: 'POST',
        body
      })
    }),
    getMe: builder.query({
      query: () => '/api/auth/me'
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST'
      })
    }),
    
    // Product endpoints
    getProducts: builder.query({
      query: (params) => ({
        url: '/api/products',
        params
      })
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/api/products/${slug}`
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: '/api/products',
        method: 'POST',
        body
      })
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/products/${id}`,
        method: 'PUT',
        body
      })
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: 'DELETE'
      })
    }),
    
      // Order endpoints
      createOrder: builder.mutation({
        query: (body) => ({
          url: '/api/orders',
          method: 'POST',
          body
        })
      }),
      getMyOrders: builder.query({
        query: () => '/api/orders/my'
      }),
      getAllOrders: builder.query({
        query: () => '/api/orders/admin/all'
      }),
      getOrderById: builder.query({
        query: (id) => `/api/orders/${id}`
      }),
      updateOrderStatus: builder.mutation({
        query: ({ id, status }) => ({
          url: `/api/orders/${id}/status`,
          method: 'PUT',
          body: { status }
        })
      }),
    
    // Review endpoints
    createReview: builder.mutation({
      query: (body) => ({
        url: '/api/reviews',
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Review', id: arg.productId }
      ]
    }),
    getReviewsByProduct: builder.query({
      query: (productId) => `/api/reviews/product/${productId}`,
      providesTags: (result, error, productId) => 
        result ? [{ type: 'Review', id: productId }] : []
    }),
    getReviewById: builder.query({
      query: (id) => `/api/reviews/${id}`
    }),
    updateReview: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/reviews/${id}`,
        method: 'PUT',
        body
      })
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/api/reviews/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Review']
    }),
    
    // Payment endpoints
    getPaymentMethods: builder.query({
      query: () => '/api/payments/methods'
    }),
    createPaymentIntent: builder.mutation({
      query: (body) => ({
        url: '/api/payments/create-intent',
        method: 'POST',
        body
      })
    }),
    confirmPayment: builder.mutation({
      query: (body) => ({
        url: '/api/payments/confirm',
        method: 'POST',
        body
      })
    }),
    refundPayment: builder.mutation({
      query: (body) => ({
        url: '/api/payments/refund',
        method: 'POST',
        body
      })
    })
  })
});

export const { 
  useRegisterMutation, 
  useLoginMutation, 
  useGetMeQuery, 
  useLogoutMutation,
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCreateReviewMutation,
  useGetReviewsByProductQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetPaymentMethodsQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useRefundPaymentMutation
} = api;
