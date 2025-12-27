import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';
//import Typography from '@mui/material/Typography';
// import AppLogo from '../../../public/Mayway_logo.jpeg'
import AppLogo from '../../../public/sk_grp_logo.png'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { Button, Menu, MenuItem, Stack, Popover, Typography, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Cookies from "js-cookie";
import api from "../../../utils/api";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import CampaignIcon from '@mui/icons-material/Campaign';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { useSelector, useDispatch } from 'react-redux';

let menuArray = [
  { redirect: 'dashboard', name: 'Dashboard', parent: 'dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
  { redirect: '#', name: 'Masters', parent: 'masters', icon: <WidgetsIcon sx={{ fontSize: 20 }} /> },
  { redirect: 'enquiry', name: 'Enquiry ', parent: 'Enquiry', icon: <PeopleIcon sx={{ fontSize: 20 }} /> },
]

let menuArray1 = [
  { redirect: 'update-site', name: 'Update site', parent: 'masters' },
  { redirect: 'existing-site', name: 'Existing site', parent: 'masters' },
  { redirect: 'category-report', name: 'Category Report', parent: 'masters' }
];

const RECENT_TABS_KEY = 'recentTabs';
const RECENT_TABS_LIMIT = 5;

function getMenuNameByPath(path) {
  // Remove leading slash
  const cleanPath = path.replace(/^\//, '');
  // Search all menu arrays
  const allMenus = [menuArray, ...Object.values({ menuArray1 })];
  for (const arr of allMenus) {
    const found = arr.find(item => item.redirect === cleanPath);
    if (found) return found.name;
  }
  return cleanPath || 'Dashboard';
}

function isWorkflowTab(path) {
  const cleanPath = path.replace(/^\//, '').split('?')[0].split('#')[0];
  const allMenus = [menuArray, ...Object.values({ menuArray1 })];
  for (const arr of allMenus) {
    if (arr.some(item => item.redirect === cleanPath)) return true;
  }
  return false;
}

function normalizePath(path) {
  return path.split('?')[0].split('#')[0];
}

function Layout(props) {

  const [selectedMenu, setSelectedMenu] = useState(null);



  const { window } = props;
  const { children } = props;

  const router = useRouter();


  const pathName = usePathname();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);


  const [username, setUsername] = React.useState("");
  const [currentMenu, setCurrentMenu] = useState('dashboard');

  const handleFirstMenuClick = (menuIndex, parent) => {
    setSelectedMenu(menuIndex);
    setCurrentMenu(parent);
    localStorage.setItem('currentMenu', parent);
  };


  useEffect(() => {
    const currentPath = pathName;
    setCurrentMenu(localStorage.getItem('currentMenu') ? localStorage.getItem('currentMenu') : 'dashboard');
    const checkPathInMenuArray = (menuArray) => {
      return menuArray.some(item => currentPath.startsWith(`/${item.redirect}`));
    };

    // Check each submenu array and set the corresponding parent menu as active
    if (checkPathInMenuArray(menuArray1)) {
      setSelectedMenu(1);
      setCurrentMenu('masters');
    }
    else {
      setSelectedMenu(0);
    }
  }, [pathName]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleLogout = () => {
    setAnchorEl(null);
    Cookies.remove('department');
    Cookies.remove('uid');

    let role = Cookies.get('role');


    Cookies.remove('role');

    if (role === "user") {
      router.push('/login')

    }
  };


  const renderMenu = (menuArray) => {
    return (
      <div style={{}}>
        <List>
          {menuArray && menuArray.map((item, index) => (
            <ListItem datatype={item.parent}
              key={item.redirect}
              disablePadding
              style={{ display: 'inline-block', width: 'auto' }}
              sx={{
                borderBottom: currentMenu.startsWith(item.parent) ? '3px solid #1976d2' : '0px solid #FFFFFF',
              }}

              className={
                pathName.startsWith("/" + item.redirect)
                  ? "text-[#1976d2]   bg-white"
                  : "text-slate-700"
              }
              onClick={() => {
                if (item.redirect !== '#' || index === 0) {
                  router.push(`/${item.redirect}`);
                } else {
                  handleFirstMenuClick(index, item.parent);
                }
              }}
            >
              <ListItemButton>
                <ListItemText
                  sx={{
                    transition: 'color 0.3s',
                    '&:hover': {
                      color: "#1976d2",
                    },
                  }}
                  primaryTypographyProps={{ fontSize: '14px' }}
                  primary={item.name}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  const [loading, setLoading] = useState(false);

  const handleflushClick = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      const response = await api.get("/redis-cache-flushall");
    } catch (error) {
      console.error("Error:", error);
    }
  };



  const subMenu = (menuArray) => {
    return (
      <div style={{}}>
        <List>
          {menuArray && menuArray.map((item, index) => (
            <ListItem
              key={item.redirect}
              disablePadding
              style={{ display: 'inline-block', width: 'auto', mx: 1, my: 0.5, borderRadius: 2, background: pathName.startsWith("/" + item.redirect) ? '#e3f2fd' : 'transparent', boxShadow: pathName.startsWith("/" + item.redirect) ? '0 2px 8px rgba(25, 118, 210, 0.08)' : 'none', borderBottom: pathName.startsWith("/" + item.redirect) ? '3px solid #1976d2' : '0px solid #FFFFFF', transition: 'all 0.2s', '&:hover': { background: '#f5faff', color: '#1976d2', }, }}
              className={
                pathName.startsWith("/" + item.redirect)
                  ? "text-[#1976d2]   bg-white"
                  : "text-slate-700"
              }
              onClick={() => {
                if (item.redirect !== '#' || index === 0) {
                  router.push(`/${item.redirect}`);
                } else {
                  handleFirstMenuClick(index, item.parent);
                }
              }}
            >
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  minWidth: 120,
                  color: pathName.startsWith("/" + item.redirect) ? '#1976d2' : '#333',
                  fontWeight: pathName.startsWith("/" + item.redirect) ? 600 : 400,
                  transition: 'color 0.2s, background 0.2s',
                  '&:hover': {
                    color: '#1976d2',
                    background: '#e3f2fd',
                  },
                }}
              >
                <ListItemText
                  primaryTypographyProps={{ fontSize: '15px', fontWeight: pathName.startsWith("/" + item.redirect) ? 600 : 400 }}
                  primary={item.name}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  // Dropdown menu state
  const [navAnchor, setNavAnchor] = useState(null);
  const [navAnchorIdx, setNavAnchorIdx] = useState(null);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navMenuCloseTimeout = useRef();

  const handleNavMenuOpen = (event, idx) => {
    clearTimeout(navMenuCloseTimeout.current);
    setNavAnchor(event.currentTarget);
    setNavAnchorIdx(idx);
    setNavMenuOpen(true);
  };
  const handleNavMenuClose = () => {
    navMenuCloseTimeout.current = setTimeout(() => {
      setNavMenuOpen(false);
      setNavAnchor(null);
      setNavAnchorIdx(null);
    }, 120);
  };
  const handleNavMenuImmediateClose = () => {
    clearTimeout(navMenuCloseTimeout.current);
    setNavMenuOpen(false);
    setNavAnchor(null);
    setNavAnchorIdx(null);
  };

  // Map parent to submenu array
  const submenuMap = {
    masters: menuArray1
  };

  // New renderMenu for dropdowns
  const renderMenuDropdown = (menuArray) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {menuArray.map((item, idx) => {
        const hasSubmenu = item.parent && submenuMap[item.parent];
        const isActive = pathName.startsWith('/' + item.redirect) || currentMenu.startsWith(item.parent);
        return (
          <Box
            key={item.redirect}
            sx={{ position: 'relative', display: 'inline-block' }}
          >
            <Button
              startIcon={item.icon}
              endIcon={hasSubmenu ? <span style={{ fontSize: 12 }}>&#9662;</span> : null}
              sx={{
                color: isActive ? '#2198F3' : '#4B4B4B',
                fontWeight: isActive ? 600 : 500,
                fontSize: '15px',
                px: 2,
                py: 1,
                borderRadius: 2,
                background: isActive ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  background: '#bbdefb',
                  color: '#1976d2',
                },
                minWidth: 0,
                textTransform: 'none',
                transition: 'all 0.2s',
              }}
              aria-haspopup={hasSubmenu ? 'true' : undefined}
              aria-controls={hasSubmenu && navMenuOpen && navAnchorIdx === idx ? `nav-menu-${idx}` : undefined}
              onClick={hasSubmenu ? (e) => {
                setCurrentMenu(item.parent);
                if (navAnchorIdx === idx && navMenuOpen) {
                  handleNavMenuImmediateClose();
                } else {
                  handleNavMenuOpen(e, idx);
                }
              } : () => {
                if (item.redirect !== '#' || idx === 0) router.push(`/${item.redirect}`);
                else handleFirstMenuClick(idx, item.parent);
              }}
            >
              {item.name}
            </Button>
            {hasSubmenu && (
              <Menu
                id={`nav-menu-${idx}`}
                anchorEl={navMenuOpen && navAnchorIdx === idx ? navAnchor : null}
                open={navMenuOpen && navAnchorIdx === idx}
                onClose={handleNavMenuImmediateClose}
                MenuListProps={{
                  sx: {
                    minWidth: 200,
                    p: 0,
                    '& .MuiMenuItem-root.Mui-focusVisible': {
                      backgroundColor: 'transparent',
                    },
                    '& .MuiMenuItem-root:focus': {
                      backgroundColor: 'transparent',
                    }
                  }
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(33, 152, 243, 0.15)',
                    background: '#fff',
                    p: 0,
                  }
                }}
              >
                {submenuMap[item.parent].map((sub, subIdx) => (
                  <MenuItem
                    key={sub.redirect}
                    onClick={() => {
                      router.push(`/${sub.redirect}`);
                      handleNavMenuImmediateClose();
                    }}
                    sx={{
                      fontSize: '15px',
                      color: pathName.startsWith('/' + sub.redirect) ? '#2198F3' : '#333',
                      fontWeight: pathName.startsWith('/' + sub.redirect) ? 600 : 400,
                      background: pathName.startsWith('/' + sub.redirect) ? '#e3f2fd' : 'transparent',
                      '&:hover': {
                        background: '#bbdefb',
                        color: '#1976d2',
                      },
                      px: 2,
                      py: 1.2,
                    }}
                  >
                    {sub.name}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
        );
      })}
    </Box>
  );

  // RECENT TABS STATE
  const [recentTabs, setRecentTabs] = useState([]);
  // On mount, load recentTabs from localStorage (persistent history)
  useEffect(() => {
    let tabs = JSON.parse(localStorage.getItem(RECENT_TABS_KEY) || '[]');
    // Filter out tabs that are not workflow tabs
    tabs = tabs.filter(tab => isWorkflowTab(tab.path));
    setRecentTabs(tabs);
  }, []);
  // On route change, update recentTabs
  useEffect(() => {
    if (!pathName) return;
    const normPath = normalizePath(pathName);
    if (!isWorkflowTab(normPath)) return;
    let tabs = JSON.parse(localStorage.getItem(RECENT_TABS_KEY) || '[]');
    // Remove if already exists (normalize for comparison)
    tabs = tabs.filter(tab => normalizePath(tab.path) !== normPath);
    // Add to front
    tabs.unshift({ path: normPath, name: getMenuNameByPath(normPath) });
    // Limit
    tabs = tabs.slice(0, RECENT_TABS_LIMIT);
    localStorage.setItem(RECENT_TABS_KEY, JSON.stringify(tabs));
    setRecentTabs(tabs);
  }, [pathName]);

  return (
    <Box sx={{ width: '100%', bgcolor: '#f2f5f9', minHeight: '100vh' }}>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          }}
        >
          <CircularProgress sx={{ color: '#fff' }} />
        </Box>
      )}
      {/* First Row: Header */}
      <Box sx={{
        width: '100%',
        bgcolor: '#2198F3',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1, sm: 3 },
        py: 1.2,
        minHeight: 56,
        position: 'sticky',
        top: 0,
        zIndex: 1200,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Image src={AppLogo} height={40} width={80} alt="Logo" style={{ objectFit: 'contain', borderRadius: 8, background: '#fff', padding: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.3rem' }, letterSpacing: 1, ml: 1, color: '#fff' }}>
            SK <span style={{ color: '#ffe082' }}>Group</span>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleflushClick}
            disabled={loading}
            sx={{
              whiteSpace: 'nowrap',
              px: 2,
              py: 0.5,
              fontSize: '0.95rem',
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(33, 152, 243, 0.10)',
              background: '#2198F3',
              '&:hover': {
                background: '#1976d2',
              },
            }}
          >
            Flush cache
          </Button>
          <Button color='inherit' onClick={handleMenuClick} sx={{ minWidth: 'auto', p: 0.5, ml: 1 }}>
            <AccountCircleIcon sx={{ fontSize: 30, color: '#fff' }} />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 1, boxShadow: '0 4px 20px rgba(103,58,183,0.10)', borderRadius: 2 } }}
          >
            <MenuItem onClick={handleClose} sx={{ py: 1, px: 2 }}>Profile</MenuItem>
            <MenuItem sx={{ py: 1, px: 2 }}>
              <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/reset-password`}>
                Reset Password
              </Link>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1, px: 2 }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
      {/* Second Row: Navigation */}
      <Box sx={{
        width: '100%',
        bgcolor: '#fff',
        boxShadow: '0 2px 8px rgba(33, 152, 243, 0.06)',
        px: { xs: 0.5, sm: 3 },
        py: 0.5,
        display: 'flex',
        alignItems: 'center',
        minHeight: 48,
        zIndex: 1100,
        position: 'sticky',
        top: 60,
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#2198F3',
          borderRadius: '3px',
          '&:hover': {
            background: '#1976d2',
          },
        },
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minWidth: 'max-content',
          px: { xs: 1, sm: 0 }
        }}>
          {renderMenuDropdown(menuArray)}
        </Box>
      </Box>
      {/* Recently Opened Tabs UI */}
      {recentTabs.length > 0 && (
        <Box sx={{
          width: '100%',
          bgcolor: '#f8f9fb',
          px: { xs: 0.5, sm: 3 },
          py: { xs: 0.5, sm: 0.5 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1 },
          borderBottom: '1px solid #e3e3e3',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          minHeight: { xs: 38, sm: 44 },
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#2198F3',
            borderRadius: '3px',
          },
        }}>
          <Typography sx={{ fontSize: { xs: '11px', sm: '13px' }, color: '#888', mr: 1, minWidth: 70, flexShrink: 0 }}>Recent Tabs:</Typography>
          {recentTabs.map(tab => (
            <Button
              key={tab.path}
              size="small"
              variant="outlined"
              sx={{
                fontSize: { xs: '11px', sm: '13px' },
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.2, sm: 0.3 },
                borderRadius: 2,
                borderColor: '#2198F3',
                color: '#2198F3',
                background: normalizePath(pathName) === tab.path ? '#e3f2fd' : '#fff',
                fontWeight: normalizePath(pathName) === tab.path ? 600 : 400,
                minWidth: 0,
                textTransform: 'none',
                mr: 1,
                flexShrink: 0,
                '&:hover': {
                  background: '#bbdefb',
                  borderColor: '#1976d2',
                  color: '#1976d2',
                },
              }}
              onClick={() => router.push(tab.path)}
            >
              {tab.name}
            </Button>
          ))}
        </Box>
      )}
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f2f5f9',
          margin: 0,
          padding: 0,
          borderRadius: 5,
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
          mt: 2,
        }}
      >
        <main style={{ marginBottom: "50px" }} className="flex-none transition-all">{children}</main>
        {/* <div className="footer" style={{
          justifyContent: 'center',
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          position: 'fixed',
          bottom: '0',
          left: '0',
          width: '100%',
          borderTopLeftRadius: '18px',
          borderTopRightRadius: '18px',
          boxShadow: '0 -2px 16px rgba(25, 118, 210, 0.10)',
          zIndex: 1200,
        }}>
          <p style={{
            textAlign: 'center',
            padding: '12px',
            display: 'inline-block',
            width: '100%',
            boxSizing: 'border-box',
            color: '#fff',
            fontWeight: 500,
            fontSize: '14px',
            letterSpacing: '0.5px',
            margin: 0,
            textShadow: '0 1px 4px rgba(0,0,0,0.10)'
          }}>
            <span style={{ verticalAlign: 'middle', marginRight: 6, fontSize: '18px' }}>💡</span>
            Software designed & developed By Mirrorinfo Tech Pvt Ltd
          </p>
        </div> */}
      </Box>
    </Box>
  );
}



export default Layout;