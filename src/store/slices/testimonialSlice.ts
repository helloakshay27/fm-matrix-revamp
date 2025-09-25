import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchTestimonials = createAsyncThunk(
    "fetchTestimonials",
    async ({ baseUrl, token, siteId }: { baseUrl: string, token: string, siteId: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/testimonials.json?site_id=${siteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get testimonials'
            return rejectWithValue(message)
        }
    }
)

export const fetchTestimonialsById = createAsyncThunk(
    "fetchTestimonialsById",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/testimonials/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get testimonials'
            return rejectWithValue(message)
        }
    }
)

export const createTestimonial = createAsyncThunk(
    "createTestimonial",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/testimonials.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create testimonial'
            return rejectWithValue(message)
        }
    }
)

export const editTestimonial = createAsyncThunk(
    "editTestimonial",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/testimonials/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create testimonial'
            return rejectWithValue(message)
        }
    }
)

const fetchTestimonialsSlice = createApiSlice("fetchTestimonials", fetchTestimonials)
const fetchTestimonialsByIdSlice = createApiSlice("fetchTestimonialsById", fetchTestimonialsById)
const createTestimonialSlice = createApiSlice("createTestimonial", createTestimonial)
const editTestimonialSlice = createApiSlice("editTestimonial", editTestimonial)

export const fetchTestimonialsReucers = fetchTestimonialsSlice.reducer
export const fetchTestimonialsByIdReucers = fetchTestimonialsByIdSlice.reducer
export const createTestimonialReucers = createTestimonialSlice.reducer
export const editTestimonialReucers = editTestimonialSlice.reducer