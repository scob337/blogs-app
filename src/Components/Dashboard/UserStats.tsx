'use client'

import { useEffect, useState } from 'react';
import { FaNewspaper, FaHeart, FaComment, FaEye } from 'react-icons/fa';
import { useUser } from '../../../contexts/UserContext';
import { formatNumber } from '../../utils/numberUtils';

interface UserStatsProps {
  className?: string;
}

interface StatsData {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
}

export default function UserStats({ className = '' }: UserStatsProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalViews: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${window.location.origin}/api/user/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats({
            totalPosts: data.totalPosts || 0,
            totalLikes: data.totalLikes || 0,
            totalComments: data.totalComments || 0,
            totalViews: data.totalViews || 0
          });
        } else {
          console.error('Failed to fetch user stats');
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) => (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 mb-2">
        {icon}
      </div>
      <span className="text-2xl font-bold text-gray-900">
        {formatNumber(value)}
      </span>
      <span className="text-sm text-gray-500 mt-1">{label}</span>
    </div>
  );

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      <StatCard 
        icon={<FaNewspaper size={20} />} 
        value={stats.totalPosts} 
        label="مقالات" 
      />
      <StatCard 
        icon={<FaHeart size={20} />} 
        value={stats.totalLikes} 
        label="إعجابات" 
      />
      <StatCard 
        icon={<FaComment size={20} />} 
        value={stats.totalComments} 
        label="تعليقات" 
      />
      <StatCard 
        icon={<FaEye size={20} />} 
        value={stats.totalViews} 
        label="مشاهدات" 
      />
    </div>
  );
}
