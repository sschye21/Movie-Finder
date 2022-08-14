import React from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function BlockedUsers (props) {

    const { u_id } = props
    const [open, setOpen] = React.useState(false)
    const [blockedUserId, setBlockedUserId] = React.useState('')
    const [blockedUsersList, setBlockedUsersList] = React.useState([])
    const activeUser = sessionStorage.getItem('token')

    const unblockUser = async (blockedUserId) => {
        const init = {
			method: "DELETE",
			url: `http://localhost:8080/api/v1/user/${activeUser}/unblock`,
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
				'block_id': blockedUserId
			}
		}

		const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            console.log(response.data.body)
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
			url: `http://localhost:8080/api/v1/user/${u_id}/block`,
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const response = await axios.request(init).catch(e => alert(e.response.data.error))
        if (response !== undefined && response.status === 200) {
            console.log(response.data.body)
			setBlockedUsersList(response.data.body)
        }
	}

    return (
        <div className='flex flex-col pt-16 px-12 mb-4'>
          <p className="text-3xl mr-2 pb-12">Blocked Users</p>
            {blockedUsersList.length !== 0 ? (
                blockedUsersList.map((item, key) => {
                    return (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            <div key={key} className="border rounded p-4 items-center flex flex-row justify-between">
                                <p className="underline hover:text-blue-400">
                                    <Link to={`/${item.user_id}`}>{item.username}</Link>
                                </p>
                                <button
                                    className='w-20 bg-red-500 hover:bg-red-400 text-white font-bold py-1 border-b-4 border-red-700 hover:border-red-500 rounded'
                                    onClick={() => {
                                        setOpen(true)
                                        setBlockedUserId(item.user_id)
                                    }}
                                >
                                    Unblock
                                </button>
                            </div>
                            {/* Delete review modal */}
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
                                                        setBlockedUserId('')
                                                    }}
                                                >
                                                    X
                                                </button>
                                            </div>
                                            <div className="flex flex-row justify-end p-6 space-x-2 border-t border-gray-200 border-gray-600">
                                                <button
                                                    className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => {
                                                        setOpen(false)
                                                        unblockUser(blockedUserId)
                                                    }}
                                                >
                                                    Unblock user?
                                                </button>
                                                <button
                                                    className="text-gray-500 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600"
                                                    onClick={() => {
                                                        setOpen(false)
                                                        setBlockedUserId('')
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (<></>)}
                        </div>
                    )
                })
            ) : (
                <p className="text-center">You have not blocked anyone.</p>
            )}
        </div>
    )
}