import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { getAppInfo } from '../../api/admin';
import { getOrders } from '../../api/order';
import { useNotification } from '../../hooks';
import MostRatedMovies from '../user/MostRatedMovies';
import AppInfoBox from './AppInfoBox';
import LatestUploads from './LatestUploads';

export default function Dashboard() {
	const [appInfo, setAppInfo] = useState({
		orderCount: 0,
		userCount: 0,
		staffCount: 0,
	})

	const { updateNotification } = useNotification()

	const fetchAppInfo = async () => {
		const { appInfo, error } = await getAppInfo()
		if (error)
			return updateNotification('error', error)
		setAppInfo({ ...appInfo })
	}

	useEffect(() => {
		fetchAppInfo()

	}, [])
	return (
		<div className='grid grid-cols-3 gap-5 my-5 p-5'>
			<AppInfoBox title={"Total Orders"}
				subTitle={appInfo.orderCount.toLocaleString()} />
			<AppInfoBox title={"Total Users"}
				subTitle={appInfo.userCount.toLocaleString()} />
			<AppInfoBox title={"Total Staff"}
				subTitle={appInfo.staffCount.toLocaleString()} />
			<LatestUploads />
		</div>

	);
}
