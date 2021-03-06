import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { Typography, Grid, TableContainer, TableHead, TableRow, TableCell, Table, TableBody, Link, Select, MenuItem, Button, Card, ListItem, List } from '@material-ui/core';
import Axios from 'axios';
import { useRouter } from 'next/dist/client/router';

function CartScreen() {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { cart: { cartItems }} = state;

    const updateCartHandler = async (item, quantity) => {
        const { data } = await Axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    };
    
    return (
        <Layout title="Shopping Cart">
            <Typography component="h1" variant="h1">
                Shopping Cart
            </Typography>
                {cartItems.length === 0 ? (
                    <div>
                        Cart is empty. <NextLink href="/" passHref>
                            <Link>Go shopping</Link>
                            </NextLink>
                    </div>
                ) : (
                    <Grid container spacing={1}>
                        <Grid item md={9} xs={12}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartItems.map((item) => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    <NextLink href={`/product/${item.slug}`} passHref>
                                                        <Link>
                                                            <Image 
                                                                src={item.image} 
                                                                alt={item.name} 
                                                                width={50} 
                                                                height={50} 
                                                            />
                                                        </Link>
                                                    </NextLink>
                                                </TableCell>
                                                <TableCell>
                                                    <NextLink href={`/product/${item.slug}`} passHref>
                                                        <Link>
                                                            <Typography>{item.name}</Typography>
                                                        </Link>
                                                    </NextLink>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Select 
                                                        value={item.quantity}  
                                                        onChange={(e)=>
                                                            updateCartHandler(item, e.target.value)}>
                                                        {[...Array(item.countInStock).keys()].map((x) => (
                                                            <MenuItem key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                                <TableCell align="right">
                                                    ${item.price}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Button variant="contained" color="danger" onClick={(item)=> {dispatch({ type: 'CART_REMOVE_ITEM', payload: item });}}>
                                                        X
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid md={3} xs={12}>
                            <Card>
                                <List>
                                    <ListItem>
                                        <Typography variant="h2">
                                            Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}items) : 
                                            ${cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Button 
                                            onClick={() => router.push('/shipping')} 
                                            variant="contained" 
                                            color="primary" 
                                            fullWidth
                                        >
                                            Check Out
                                        </Button>
                                    </ListItem>
                                </List>
                            </Card>                           
                        </Grid>
                    </Grid>
                )}
        </Layout>
    )
}
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false});