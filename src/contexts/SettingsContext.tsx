import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface VoucherData {
  id: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
}

export interface BankData {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface PriceData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
}

export interface RolePermission {
  userId: string;
  username: string;
  permissions: {
    [page: string]: boolean;
  };
}

export interface BonusSettings {
  gajiPokok: number;
  bonusPerHalaman: number;
  withdrawalWhatsapp: string;
}

export interface WithdrawalRequest {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bankInfo: string;
  accountNumber: string;
  amount: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  studentReports?: { nama: string; halaqah: string; pencapaian: number; bonus: number }[];
}

interface SettingsContextType {
  // Vouchers
  vouchers: VoucherData[];
  addVoucher: (voucher: Omit<VoucherData, 'id'>) => void;
  updateVoucher: (id: string, voucher: Partial<VoucherData>) => void;
  deleteVoucher: (id: string) => void;
  
  // Banks
  banks: BankData[];
  addBank: (bank: Omit<BankData, 'id'>) => void;
  updateBank: (id: string, bank: Partial<BankData>) => void;
  deleteBank: (id: string) => void;
  
  // Prices
  prices: PriceData[];
  updatePrice: (id: string, price: Partial<PriceData>) => void;
  
  // WhatsApp
  whatsappNumber: string;
  setWhatsappNumber: (number: string) => void;
  
  // Role Permissions
  rolePermissions: RolePermission[];
  updateRolePermission: (userId: string, page: string, allowed: boolean) => void;
  addUser: (user: { username: string; password: string }) => void;
  deleteUser: (userId: string) => void;
  updateUserPassword: (userId: string, newPassword: string) => void;
  users: { id: string; username: string; password: string }[];
  
  // Bonus Settings
  bonusSettings: BonusSettings;
  updateBonusSettings: (settings: Partial<BonusSettings>) => void;
  
  // Withdrawal Requests
  withdrawalRequests: WithdrawalRequest[];
  addWithdrawalRequest: (request: Omit<WithdrawalRequest, 'id' | 'status'>) => void;
  updateWithdrawalStatus: (id: string, status: WithdrawalRequest['status']) => void;
  deleteWithdrawalRequest: (id: string) => void;
}

const defaultPrices: PriceData[] = [
  { id: 'attendance', name: 'Attendance', price: 65000 },
  { id: 'memorization', name: 'Memorization', price: 120000 },
  { id: 'activities', name: 'Activities', price: 8250, originalPrice: 82500 },
  { id: 'finance', name: 'Finance', price: 99000 },
  { id: 'full-package', name: 'Full Package', price: 249000 },
];

const defaultVouchers: VoucherData[] = [
  { id: '1', code: 'ramadhan', discount: 49, startDate: '2026-01-01', endDate: '2026-12-31' },
  { id: '2', code: 'merdeka', discount: 17, startDate: '2026-01-01', endDate: '2026-12-31' },
  { id: '3', code: 'muharam', discount: 20, startDate: '2026-01-01', endDate: '2026-12-31' },
  { id: '4', code: 'bayardengandoa', discount: 90, startDate: '2026-01-01', endDate: '2026-12-31' },
];

const defaultBanks: BankData[] = [
  { id: '1', bankName: 'BRI', accountNumber: '404301015163532', accountHolder: 'MARKAZ QURAN' },
];

const defaultBonusSettings: BonusSettings = {
  gajiPokok: 600000,
  bonusPerHalaman: 1500,
  withdrawalWhatsapp: '6285223857484',
};

const defaultUsers = [
  { id: '1', username: 'admin', password: 'admin123' },
  { id: '2', username: 'guest', password: 'guest123' },
  { id: '3', username: 'demopesantren', password: 'freeplan' },
  { id: '4', username: 'demopesantren1', password: 'freeplan' },
  { id: '5', username: 'demopesantren2', password: 'freeplan' },
  { id: '6', username: 'demopesantren3', password: 'freeplan' },
  { id: '7', username: 'demopesantren4', password: 'freeplan' },
];

const allPages = [
  'dashboard', 'profile', 'attendance', 'halaqah', 'activities', 
  'finance', 'event', 'add-student', 'upgrade', 'payment', 'setting'
];

const generateDefaultPermissions = () => {
  const permissions: RolePermission[] = defaultUsers.map(user => ({
    userId: user.id,
    username: user.username,
    permissions: allPages.reduce((acc, page) => {
      // Guest only has dashboard access
      if (user.username === 'guest') {
        acc[page] = page === 'dashboard';
      } else {
        acc[page] = true;
      }
      return acc;
    }, {} as { [page: string]: boolean })
  }));
  return permissions;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vouchers, setVouchers] = useState<VoucherData[]>(() => {
    const stored = localStorage.getItem('kdm_vouchers');
    return stored ? JSON.parse(stored) : defaultVouchers;
  });
  
  const [banks, setBanks] = useState<BankData[]>(() => {
    const stored = localStorage.getItem('kdm_banks');
    return stored ? JSON.parse(stored) : defaultBanks;
  });
  
  const [prices, setPrices] = useState<PriceData[]>(() => {
    const stored = localStorage.getItem('kdm_prices');
    return stored ? JSON.parse(stored) : defaultPrices;
  });
  
  const [whatsappNumber, setWhatsappNumberState] = useState<string>(() => {
    const stored = localStorage.getItem('kdm_whatsapp');
    return stored || '6285223857484';
  });
  
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(() => {
    const stored = localStorage.getItem('kdm_role_permissions');
    return stored ? JSON.parse(stored) : generateDefaultPermissions();
  });
  
  const [users, setUsers] = useState<{ id: string; username: string; password: string }[]>(() => {
    const stored = localStorage.getItem('kdm_users');
    return stored ? JSON.parse(stored) : defaultUsers;
  });
  
  const [bonusSettings, setBonusSettings] = useState<BonusSettings>(() => {
    const stored = localStorage.getItem('kdm_bonus_settings');
    return stored ? JSON.parse(stored) : defaultBonusSettings;
  });
  
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const stored = localStorage.getItem('kdm_withdrawal_requests');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('kdm_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);
  
  useEffect(() => {
    localStorage.setItem('kdm_banks', JSON.stringify(banks));
  }, [banks]);
  
  useEffect(() => {
    localStorage.setItem('kdm_prices', JSON.stringify(prices));
  }, [prices]);
  
  useEffect(() => {
    localStorage.setItem('kdm_whatsapp', whatsappNumber);
  }, [whatsappNumber]);
  
  useEffect(() => {
    localStorage.setItem('kdm_role_permissions', JSON.stringify(rolePermissions));
  }, [rolePermissions]);
  
  useEffect(() => {
    localStorage.setItem('kdm_users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('kdm_bonus_settings', JSON.stringify(bonusSettings));
  }, [bonusSettings]);
  
  useEffect(() => {
    localStorage.setItem('kdm_withdrawal_requests', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  // Voucher functions
  const addVoucher = (voucher: Omit<VoucherData, 'id'>) => {
    const newVoucher = { ...voucher, id: Date.now().toString() };
    setVouchers([...vouchers, newVoucher]);
  };
  
  const updateVoucher = (id: string, voucher: Partial<VoucherData>) => {
    setVouchers(vouchers.map(v => v.id === id ? { ...v, ...voucher } : v));
  };
  
  const deleteVoucher = (id: string) => {
    setVouchers(vouchers.filter(v => v.id !== id));
  };

  // Bank functions
  const addBank = (bank: Omit<BankData, 'id'>) => {
    const newBank = { ...bank, id: Date.now().toString() };
    setBanks([...banks, newBank]);
  };
  
  const updateBank = (id: string, bank: Partial<BankData>) => {
    setBanks(banks.map(b => b.id === id ? { ...b, ...bank } : b));
  };
  
  const deleteBank = (id: string) => {
    setBanks(banks.filter(b => b.id !== id));
  };

  // Price functions
  const updatePrice = (id: string, price: Partial<PriceData>) => {
    setPrices(prices.map(p => p.id === id ? { ...p, ...price } : p));
  };

  // WhatsApp function
  const setWhatsappNumber = (number: string) => {
    setWhatsappNumberState(number);
  };

  // Role permission functions
  const updateRolePermission = (userId: string, page: string, allowed: boolean) => {
    setRolePermissions(rolePermissions.map(rp => 
      rp.userId === userId 
        ? { ...rp, permissions: { ...rp.permissions, [page]: allowed } }
        : rp
    ));
  };

  // User management functions
  const addUser = (user: { username: string; password: string }) => {
    const newUserId = Date.now().toString();
    const newUser = { id: newUserId, ...user };
    setUsers([...users, newUser]);
    
    // Add default permissions for new user
    const newPermission: RolePermission = {
      userId: newUserId,
      username: user.username,
      permissions: allPages.reduce((acc, page) => {
        acc[page] = true;
        return acc;
      }, {} as { [page: string]: boolean })
    };
    setRolePermissions([...rolePermissions, newPermission]);
  };
  
  const deleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setRolePermissions(rolePermissions.filter(rp => rp.userId !== userId));
  };
  
  const updateUserPassword = (userId: string, newPassword: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, password: newPassword } : u));
  };
  
  // Bonus settings functions
  const updateBonusSettings = (settings: Partial<BonusSettings>) => {
    setBonusSettings(prev => ({ ...prev, ...settings }));
  };
  
  // Withdrawal request functions
  const addWithdrawalRequest = (request: Omit<WithdrawalRequest, 'id' | 'status'>) => {
    const newRequest: WithdrawalRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
    };
    setWithdrawalRequests(prev => [...prev, newRequest]);
  };
  
  const updateWithdrawalStatus = (id: string, status: WithdrawalRequest['status']) => {
    setWithdrawalRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status } : req)
    );
  };
  
  const deleteWithdrawalRequest = (id: string) => {
    setWithdrawalRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <SettingsContext.Provider value={{
      vouchers,
      addVoucher,
      updateVoucher,
      deleteVoucher,
      banks,
      addBank,
      updateBank,
      deleteBank,
      prices,
      updatePrice,
      whatsappNumber,
      setWhatsappNumber,
      rolePermissions,
      updateRolePermission,
      addUser,
      deleteUser,
      updateUserPassword,
      users,
      bonusSettings,
      updateBonusSettings,
      withdrawalRequests,
      addWithdrawalRequest,
      updateWithdrawalStatus,
      deleteWithdrawalRequest,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
