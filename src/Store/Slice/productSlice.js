import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch user view history
export const fetchUserViewHistory = createAsyncThunk(
  "product/fetchUserViewHistory",
  async (token) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/user/viewHistory`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.products; // Return view history data
    } catch (error) {
      throw new Error(error.response.data.message); // Throw error message
    }
  }
);

// Fetch liked products
export const fetchLikedProducts = createAsyncThunk(
  "product/fetchLikedProducts",
  async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/products/liked/${userId}`
      );
      return response.data; // Return liked products data
    } catch (error) {
      throw new Error(error.response.data.message); // Throw error message
    }
  }
);

// Fetch recommended products
export const fetchRecommendedProducts = createAsyncThunk(
  "product/fetchRecommendedProducts",
  async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/products/recommended/${userId}`
      );
      return response.data; // Return recommended products data
    } catch (error) {
      throw new Error(error.response.data.message); // Throw error message
    }
  }
);

// Rate a product
export const rateProduct = createAsyncThunk(
  "product/rateProduct",
  async ({ id, newRating, token }) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/products/rate/${id}`,
        { rating: newRating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Return the updated product or rating response
    } catch (error) {
      throw new Error(error.response.data.message); // Throw error message
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    viewHistory: null,
    likedProducts: null,
    recommendedProducts: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // User View History
      .addCase(fetchUserViewHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserViewHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.viewHistory = action.payload;
      })
      .addCase(fetchUserViewHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      // Liked Products
      .addCase(fetchLikedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.likedProducts = action.payload;
      })
      .addCase(fetchLikedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      // Recommended Products
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
    // Rate Product
    // .addCase(rateProduct.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(rateProduct.fulfilled, (state, action) => {
    //   state.loading = false;
    //   // Update state with the new rating if necessary
    //   // Assuming action.payload contains updated product data
    //   // You might want to update the specific product in viewHistory, likedProducts, or recommendedProducts
    // })
    // .addCase(rateProduct.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.error.message || "An error occurred";
    // });
  },
});

export default productSlice.reducer;
