import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Chip, IconButton, FormControlLabel, Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppContext } from '../context/AppContext';

function Products() {
  const { products, addProduct, deleteProduct, updateProduct, error } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', stock: '', customizable: false
  });

  const handleAdd = async () => {
    setSubmitError(null);
    console.log('🚀 Product handleAdd called with:', newProduct);
    
    // Validate required fields
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setSubmitError('Please fill in all required fields (Name, Price, Stock)');
      console.error('❌ Validation failed - missing required fields');
      return;
    }
    
    // Validate numeric fields
    const price = parseFloat(newProduct.price);
    const stock = parseInt(newProduct.stock);
    
    if (isNaN(price) || price <= 0) {
      setSubmitError('Price must be a positive number');
      return;
    }
    
    if (isNaN(stock) || stock < 0) {
      setSubmitError('Stock must be a non-negative number');
      return;
    }
    
    setLoading(true);
    console.log('✅ Validation passed, submitting product...');
    
    try {
      if (editMode && selectedProduct) {
        console.log('📝 Updating product:', selectedProduct.id);
        await updateProduct(selectedProduct.id, {
          ...newProduct,
          price: price,
          stock: stock
        });
      } else {
        console.log('➕ Adding new product');
        const productToAdd = {
          name: newProduct.name.trim(),
          description: newProduct.description || '',
          price: price,
          stock: stock,
          customizable: newProduct.customizable || false
        };
        console.log('📦 Product data to add:', productToAdd);
        await addProduct(productToAdd);
      }
      
      setNewProduct({ name: '', description: '', price: '', stock: '', customizable: false });
      setOpen(false);
      setEditMode(false);
      setSelectedProduct(null);
      setSubmitError(null);
      console.log('✅ Product saved successfully!');
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to save product. Please try again.';
      setSubmitError(errorMessage);
      console.error('❌ Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product?.name || '',
      description: product?.description || '',
      price: (product?.price || 0).toString(),
      stock: (product?.stock || 0).toString(),
      customizable: product?.customizable || false
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedProduct(null);
    setNewProduct({ name: '', description: '', price: '', stock: '', customizable: false });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Products
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage furniture products and inventory
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Add Product
        </Button>
      </Box>

      {/* Products Table */}
      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customizable</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {product.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ₹ {product.price.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${product.stock} pcs`}
                      color={product.stock < 10 ? 'error' : 'success'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.customizable ? 'Yes' : 'No'}
                      color={product.customizable ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(product)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Product Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newProduct.customizable}
                    onChange={(e) => setNewProduct({...newProduct, customizable: e.target.checked})}
                  />
                }
                label="Customizable Product"
              />
            </Grid>
          </Grid>
        </DialogContent>
        {submitError && (
          <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1, mx: 2, mb: 1 }}>
            <Typography variant="body2" color="error">
              ❌ {submitError}
            </Typography>
          </Box>
        )}
        {error && (
          <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1, mx: 2, mb: 1 }}>
            <Typography variant="body2" color="error">
              ❌ {error}
            </Typography>
          </Box>
        )}
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={loading}>
            {loading ? 'Saving...' : (editMode ? 'Update Product' : 'Add Product')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Products;
