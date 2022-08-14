import React, { useState } from 'react';
import axios from 'axios';
import { Dialog } from '@mui/material';

import Wishlist from './Wishlist';
import BlockedUsers from '../components/BlockedUsers'
import DisplayUserReviews from './DisplayUserReviews'

import { getToken } from '../util/useToken';
import { useNavigate } from 'react-router-dom';

function UserProfile(props) {
	const {firstName, lastName, email, u_id, password, userName, wishlist, setUserData, getUserData} = props
	const navigate = useNavigate()
	const [dialogState, setDialogState] = useState('')
	const [deleteDialogState, setDeleteDialogState] = useState('')
	const [open, setOpen] = React.useState(false)
	const [isBlocked, setIsBlocked] = React.useState(false)
	const [newUserData, setNewUserData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		userName: '',
		password: '',
		confirmPassword: '',
		delete: ''
	})
	const activeUser = sessionStorage.getItem('token')

	const isUser = Number(u_id) === Number(getToken())

	const updateUser = async () => {
		const init = {
			method: 'PUT',
			url: `http://localhost:8080/api/v1/user/${u_id}/`,
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				firstName: newUserData.firstName || firstName,
				lastName: newUserData.lastName || lastName,
				email: newUserData.email || email,
				userName: newUserData.userName || userName,
				password: newUserData.password || password,
				wishlist: wishlist
			}
		}
		const response = await axios.request(init).catch(e => alert(e.response.error))
			if (response !== undefined && response.status === 200) {
				setUserData(response.data.body)
				getUserData()
		}
	}
	
	const deleteUser = async () => {
		const init = {
			method: 'DELETE',
			url: `http://localhost:8080/api/v1/user/delete/${u_id}/`,
			headers: {
				'Content-Type': 'application/json'
			}
		}
		const response = await axios.request(init).catch(e => alert(JSON.stringify(e.response.data)))
		if (response !== undefined && response.status === 200) {
			setDeleteDialogState(false)
			sessionStorage.removeItem('token')
			navigate('/login')
		}
	}
	
	const validate = () => {
		if (newUserData.password !== newUserData.confirmPassword) {
			alert("Password does not match")
			return false
		}
		return true
	}
	
	const handleSubmit = async e => {
		e.preventDefault();
		if (validate()) {
			updateUser()
			setUserData(newUserData)
		}
	}

	const handleChange = (prop) => (event) => {
		event.preventDefault();
		setNewUserData({ ...newUserData, [prop]: event.target.value });
	};
	
	const handleDelete = (e) => {
		e.preventDefault();
		console.log(newUserData)
		if (newUserData.delete === 'DELETE') {
			deleteUser()
		} else {
			alert("Please type DELETE to confirm")
		}
	}

	const blockUser = async () => {
		const init = {
			method: "POST",
			url: `http://localhost:8080/api/v1/user/${activeUser}/block`,
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				'block_id': u_id
			}
		}

		const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            console.log(response.data)
			setIsBlocked(true)
			getBlockedUsers()
        }
	}

	const unblockUser = async () => {
		const init = {
			method: "DELETE",
			url: `http://localhost:8080/api/v1/user/${activeUser}/unblock`,
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				'block_id': u_id
			}
		}

		const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            console.log(response.data)
			setIsBlocked(false)
			getBlockedUsers()
        }
	}

	React.useEffect(() => {
		getBlockedUsers()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const getBlockedUsers = async () => {
		const init = {
			method: "GET",
			url: `http://localhost:8080/api/v1/user/${activeUser}/block`,
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            console.log(response.data)
			response.data.body.forEach(item => {
				console.log(item)
				if (u_id === parseInt(item.user_id)) {
					setIsBlocked(true)
				}
			})
        }
	}

	return (
		<div className='text-white pt-16'>
		<div className='flex flex-row justify-between px-12'>
			<div className='gap-10 flex flex-row'>
				<p className="text-3xl">{userName}</p>
				<div className='flex flex-col'>
					<p className="">{firstName} {lastName}</p>
					<p className="">{email}</p>
				</div>
			</div>
			{isUser ? (
				<div className='flex-col text-right'>
					<p className="text-[#AFAAB9] cursor-pointer" onClick={() => {setDialogState(true)}}>Edit details</p>
					<p className="text-red-300 cursor-pointer" onClick={() => {setDeleteDialogState(true)}}>Delete account</p>
				</div>
			) : (
				<button
					className='w-20 bg-red-500 hover:bg-red-400 text-white font-bold py-0.5 border-b-4 border-red-700 hover:border-red-500 rounded mt-3'
					onClick={() => {
						setOpen(true)
					}}
				>
				{isBlocked ? "Unblock" : "Block"}
				</button>
			) }
			{/* Block User modal */}
			{open ? (
				<div className="fixed top-0 left-0 right-0 z-50 w-full overflow-x-hidden lg:bg-gray-900 lg:bg-opacity-50 md:bg-gray-900 md:bg-opacity-50 overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex">
					<div className="relative w-full h-full max-w-2xl p-4 md:h-auto">
						<div className="relative bg-white rounded-lg shadow bg-gray-700">
							<div className="flex items-start justify-between p-4 border-b border-gray-600">
								<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
									Are you sure?
								</h3>
								<button 
									onClick={() => {
										setOpen(false)
									}}
								>
									X
								</button>
							</div>
							<div className="flex flex-row justify-end p-6 space-x-2 border-t border-gray-200 border-gray-600">
								<button
									className="bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-600 hover:bg-red-700"
									onClick={() => {
										setOpen(false)
										if (isBlocked) {
											unblockUser()
										} else {
											blockUser()
										}
									}}
								>
									{isBlocked ? "Unblock" : "Block"} User
								</button>
								<button
									className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600"
									onClick={() => {
										setOpen(false)
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			) : (<></>)}
			
			{dialogState && <Dialog open={dialogState} onClose={() => {setDialogState(false)}}>
				<div className="shadow-lg max-w-md p-8 flex flex-col justify-center items-center">
					<h1 className="text-2xl font-bold pb-4">Edit details</h1>
					<form className="w-[100%]" onSubmit={handleSubmit}>
						<div className="flex">
							<div className="m-2">
								<label className="pr-5 block text-white text-sm font-bold mb-2 text-left">First Name</label>
								<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={newUserData.firstName || firstName} onChange={handleChange('firstName')}/>
							</div>
							<div className="m-2">
								<label className="pr-5 block text-white text-sm font-bold mb-2 text-left">Last Name</label>
								<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={newUserData.lastName || lastName} onChange={handleChange('lastName')}/>
							</div>
							</div>
							<div className="m-2">
								<label className="pr-5 block text-white text-sm font-bold mb-2 text-left">Email</label>
								<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={newUserData.email || email} onChange={handleChange('email')}/>
							</div>
							<div className="m-2">
								<label className="pr-5 block text-white text-sm font-bold mb-2 text-left">Username</label>
								<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={newUserData.userName || userName} onChange={handleChange('userName')}/>
							</div>
							<div className='flex'>
								<div className="m-2">
									<label className="pr-5 block text-white text-sm font-bold mb-2 text-left">New Password</label>
									<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" onChange={handleChange('password')}/>
								</div>
							<div className="m-2">
								<label className="pr-5 block text-white text-sm font-bold mb-2 text-left">Confirm New Password</label>
								<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" onChange={handleChange('confirmPassword')}/>
							</div>
						</div>
						<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>
					</form>
				</div>
			</Dialog>}
			{deleteDialogState && <Dialog open={deleteDialogState}
				onClose={() => {setDeleteDialogState(false)}}
			>
				<div className="shadow-lg max-w-md p-8 flex flex-col justify-center items-center">
					<h1>Delete account?</h1>
					<form className="w-[100%]" onSubmit={handleDelete}>
						<div className="m-2">
						<label className="pr-5 block text-white text-sm font-bold mb-2 text-left">Type DELETE to confirm</label>
						<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={handleChange('delete')}/>
						</div>
						<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>
					</form>
				</div>
			</Dialog>}
			{deleteDialogState && <Dialog open={deleteDialogState}
			onClose={() => {setDeleteDialogState(false)}}>
				<div className="shadow-lg max-w-md p-8 flex flex-col justify-center items-center">
					<h1>Delete account?</h1>
					<form className="w-[100%]" onSubmit={handleDelete}>
						<div className="m-2">
						<label className="pr-5 block text-white text-sm font-bold mb-2 text-left">Type DELETE to confirm</label>
						<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" onChange={handleChange('delete')}/>
						</div>
						<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>
					</form>
				</div>
			</Dialog>}
		</div>
		<Wishlist items={wishlist} isUser={isUser} userName={userName} />
		<DisplayUserReviews u_id={u_id} isUser={isUser} />
		{isUser && <BlockedUsers u_id={u_id} />}
		</div>
	);
}

export default UserProfile;