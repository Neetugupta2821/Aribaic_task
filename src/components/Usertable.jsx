import React, { useState, useEffect, useRef } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Box,
    Collapse,
    Avatar,
    Select,
    MenuItem as MuiMenuItem,
    Chip,
    FormControl,
    TextField,
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
const Usertable = () => {
 
        const [rows, setRows] = useState([]);
        const [anchorEl, setAnchorEl] = useState(null);
        const [dropdownOpen, setDropdownOpen] = useState({});
        const [selectedRowIndex, setSelectedRowIndex] = useState(null);
        const [openSubtaskRows, setOpenSubtaskRows] = useState({});
        const [anchorEls, setAnchorEls] = useState({});
        const [availablePersons, setAvailablePersons] = useState([
            { name: 'Person 1', avatar: 'https://i.pravatar.cc/150?img=1' },
            { name: 'Person 2', avatar: 'https://i.pravatar.cc/150?img=2' },
            { name: 'Person 3', avatar: null },
            { name: 'Person 4', avatar: 'https://i.pravatar.cc/150?img=4' },
            { name: 'Person 5', avatar: 'https://i.pravatar.cc/150?img=5' },
        ]);
     
        const [selectedDropdownOptions, setSelectedDropdownOptions] = useState({});
        const [statusOptions, setStatusOptions] = useState(['Stuck', 'Working on It', 'Done', 'default']);
        const isInitialRender = useRef(true);
    
        useEffect(() => {
            if (isInitialRender.current) {
                const storedData = localStorage.getItem('userTableData');
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    const deserializedRows = parsedData.rows.map((row) => ({
                        ...row,
                        persons: row.persons.map((index) => availablePersons[index]),
                    }));
                    setRows(deserializedRows);
                    setSelectedDropdownOptions(parsedData.selectedDropdownOptions || {});
                }
                isInitialRender.current = false;
            }
        }, []);
    
        useEffect(() => {
            if (!isInitialRender.current) {
                const serializedRows = rows.map((row) => ({
                    ...row,
                    persons: row.persons.map((person) => availablePersons.indexOf(person)),
                }));
                localStorage.setItem(
                    'userTableData',
                    JSON.stringify({
                        rows: serializedRows,
                        selectedDropdownOptions: selectedDropdownOptions,
                    })
                );
            }
        }, [rows, selectedDropdownOptions]);
    
        const handleDropdownOpen = (event, index) => {
            setAnchorEls({ ...anchorEls, [index]: event.currentTarget });
            setDropdownOpen({ ...dropdownOpen, [index]: true });
            setSelectedRowIndex(index);
        };
    
        const handleDropdownOptionChange = (option, index) => {
            const newSelectedOptions = { ...selectedDropdownOptions };
            if (!newSelectedOptions[index]) {
                newSelectedOptions[index] = [];
            }
            if (newSelectedOptions[index].includes(option)) {
                newSelectedOptions[index] = newSelectedOptions[index].filter((item) => item !== option);
            } else {
                newSelectedOptions[index] = [...newSelectedOptions[index], option];
            }
            setSelectedDropdownOptions(newSelectedOptions);
        };
    
        const handleDropdownClose = (index) => {
            setAnchorEls({ ...anchorEls, [index]: null });
            setDropdownOpen({ ...dropdownOpen, [index]: false });
            setSelectedRowIndex(null);
        };
    
        const handleCheckboxChange = (event, index) => {
            const newRows = [...rows];
            newRows[index].checked = event.target.checked;
            setRows(newRows);
        };
    
        const handleMenuClick = (event, index) => {
            setAnchorEl(event.currentTarget);
            setSelectedRowIndex(index);
        };
    
        const handleMenuClose = () => {
            setAnchorEl(null);
            setSelectedRowIndex(null);
        };
    
        const handleEditLabels = () => {
            console.log('Edit Labels clicked');
            handleMenuClose();
        };
    
        const handleAddRow = (e) => {
            e.preventDefault();
            const newRow = {
                checked: false,
                title: 'New ask new',
                persons: [],
                date: null,
                status: null,
                subtasks: [],
            };
            setRows([...rows, newRow]);
        };
    
        const getStatusColor = (status) => {
            switch (status) {
                case 'Stuck':
                    return '#FFC107';
                case 'Working on It':
                    return '#FF9800';
                case 'Done':
                    return '#4CAF50';
                case 'default':
                    return '#F44336';
                default:
                    return 'transparent';
            }
        };
    
    
        const handleToggleSubtask = (index) => {
            setOpenSubtaskRows({
                ...openSubtaskRows,
                [index]: !openSubtaskRows[index],
            });
        };
    
        const getSubtaskCount = (subtasks) => {
            return subtasks ? subtasks.length : 0;
        };
    
        const handlePersonChange = (event, rowIndex) => {
            const { value } = event.target;
            const newRows = [...rows];
            newRows[rowIndex].persons = value.map((personIndex) => availablePersons[personIndex]);
            setRows(newRows);
        };
    
        const handleStatusChange = (event, index) => {
            const newRows = [...rows];
            newRows[index].status = event.target.value;
            setRows(newRows);
        };
    
        const handleDateChange = (date, index) => {
            const newRows = [...rows];
            newRows[index].date = date;
            setRows(newRows);
        };
    
        const handleAddSubtask = (rowIndex) => {
            const newRows = [...rows];
            newRows[rowIndex].subtasks.push({ title: 'New Subtask', person: null, status: null, text: '' });
            setRows(newRows);
        };
    
        const handleSubtaskPersonChange = (event, rowIndex, subIndex) => {
            const { value } = event.target;
            const newRows = [...rows];
            newRows[rowIndex].subtasks[subIndex].person = availablePersons[value];
            setRows(newRows);
        };
    
        const handleSubtaskStatusChange = (event, rowIndex, subIndex) => {
            const newRows = [...rows];
            newRows[rowIndex].subtasks[subIndex].status = event.target.value;
            setRows(newRows);
        };
    
        const handleSubtaskTextChange = (event, rowIndex, subIndex) => {
            const newRows = [...rows];
            newRows[rowIndex].subtasks[subIndex].text = event.target.value;
            setRows(newRows);
        };
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" />
                            <TableCell>ask new</TableCell>
                            <TableCell>Person</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>status</TableCell>
                            <TableCell>Dropdown</TableCell>
                            <TableCell><AddCircleIcon/></TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <React.Fragment key={index}>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={row.checked} onChange={(event) => handleCheckboxChange(event, index)} />
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center">
                                            <IconButton onClick={() => handleToggleSubtask(index)}>
                                                {openSubtaskRows[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                            </IconButton>
                                            {row.title} ({getSubtaskCount(row.subtasks)})
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            multiple
                                            value={row.persons.map((person) => availablePersons.indexOf(person))}
                                            onChange={(event) => handlePersonChange(event, index)}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((personIndex) => (
                                                        <Chip
                                                            key={personIndex}
                                                            avatar={<Avatar src={availablePersons[personIndex].avatar} />}
                                                            label={availablePersons[personIndex].name} // Corrected line
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {availablePersons.map((person, personIndex) => (
                                                <MuiMenuItem key={personIndex} value={personIndex}>
                                                    <Box display="flex" alignItems="center">
                                                        {person.avatar && (
                                                            <Avatar
                                                                src={person.avatar}
                                                                sx={{ width: 24, height: 24, marginRight: 1 }}
                                                            />
                                                        )}
                                                        {person.name}
                                                    </Box>
                                                </MuiMenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <DatePicker
                                            selected={row.date}
                                            onChange={(date) => handleDateChange(date, index)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                value={row.status || ''}
                                                onChange={(event) => handleStatusChange(event, index)}
                                                displayEmpty
                                                renderValue={(selected) => (
                                                    <Box
                                                        sx={{
                                                            backgroundColor: getStatusColor(selected),
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            display: 'inline-block',
                                                            minWidth: '100px',
                                                        }}
                                                    >
                                                        {selected || 'Select Status'}
                                                    </Box>
                                                )}
                                            >
                                                <MenuItem value="">
                                                    <em>Select Status</em>
                                                </MenuItem>
                                                {statusOptions.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        {selectedDropdownOptions[index] &&
                                            selectedDropdownOptions[index].map((option) => (
                                                <Chip key={option} label={option} sx={{ marginRight: 1 }} />
                                            ))}

                                        {(!selectedDropdownOptions[index] ||
                                            selectedDropdownOptions[index].length === 0) && (
                                                <p onClick={(event) => handleDropdownOpen(event, index)}>-</p>
                                            )}

                                        <Menu
                                            anchorEl={anchorEls[index]}
                                            open={dropdownOpen[index] && selectedRowIndex === index}
                                            onClose={() => handleDropdownClose(index)}
                                        >
                                            <MenuItem>
                                                <Checkbox
                                                    checked={
                                                        selectedDropdownOptions[index] &&
                                                        selectedDropdownOptions[index].includes('Week')
                                                    }
                                                    onChange={() => handleDropdownOptionChange('Week', index)}
                                                />
                                                Week
                                            </MenuItem>
                                            <MenuItem>
                                                <Checkbox
                                                    checked={
                                                        selectedDropdownOptions[index] &&
                                                        selectedDropdownOptions[index].includes('Day')
                                                    }
                                                    onChange={() => handleDropdownOptionChange('Day', index)}
                                                />
                                                Day
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>

                                    <TableCell align="right">
                                        <IconButton onClick={(event) => handleMenuClick(event, index)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl) && selectedRowIndex === index}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleEditLabels}>Edit Labels</MenuItem>
                                            <MenuItem onClick={() => handleAddSubtask(index)}>
                                                Add Subtask
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell
                                        style={{ paddingBottom: 0, paddingTop: 0 }}
                                        colSpan={7}
                                    >
                                        <Collapse
                                            in={openSubtaskRows[index]}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Box sx={{ margin: 1 }}>
                                                <Table size="small" aria-label="purchases">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell padding="checkbox" />
                                                            <TableCell>Subtask</TableCell>
                                                            <TableCell>People</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Text</TableCell>
                                                            <TableCell />
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {row.subtasks &&
                                                            row.subtasks.map((subtask, subIndex) => (
                                                                <TableRow key={subIndex}>
                                                                    <TableCell padding="checkbox">
                                                                        <Checkbox />
                                                                    </TableCell>
                                                                    <TableCell>{subtask.title}</TableCell>
                                                                    <TableCell>
                                                                        <Select
                                                                            value={availablePersons.indexOf(subtask.person)}
                                                                            onChange={(event) =>
                                                                                handleSubtaskPersonChange(
                                                                                    event,
                                                                                    index,
                                                                                    subIndex
                                                                                )
                                                                            }
                                                                            renderValue={(selected) => {
                                                                                const person = availablePersons[selected];
                                                                                return (
                                                                                    <Box display="flex" alignItems="center">
                                                                                        {person && person.avatar && (
                                                                                            <Avatar
                                                                                                src={person.avatar}
                                                                                                sx={{
                                                                                                    width: 24,
                                                                                                    height: 24,
                                                                                                    marginRight: 1,
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                        {person ? person.name : ""}
                                                                                    </Box>
                                                                                );
                                                                            }}
                                                                        >
                                                                            {availablePersons.map((person, personIndex) => (
                                                                                <MuiMenuItem key={personIndex} value={personIndex}>
                                                                                    <Box display="flex" alignItems="center">
                                                                                        {person.avatar && (
                                                                                            <Avatar
                                                                                                src={person.avatar}
                                                                                                sx={{
                                                                                                    width: 24,
                                                                                                    height: 24,
                                                                                                    marginRight: 1,
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                        {person.name}
                                                                                    </Box>
                                                                                </MuiMenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <FormControl fullWidth>
                                                                            <Select
                                                                                value={subtask.status || ''}
                                                                                onChange={(event) =>
                                                                                    handleSubtaskStatusChange(
                                                                                        event,
                                                                                        index,
                                                                                        subIndex
                                                                                    )
                                                                                }
                                                                                displayEmpty
                                                                                renderValue={(selected) => (
                                                                                    <Box
                                                                                        sx={{
                                                                                            backgroundColor:
                                                                                                getStatusColor(selected),
                                                                                            padding: '4px 8px',
                                                                                            borderRadius: '4px',
                                                                                            display: 'inline-block',
                                                                                            minWidth: "100px"
                                                                                        }}
                                                                                    >
                                                                                        {selected || 'Select Status'}
                                                                                    </Box>
                                                                                )}
                                                                            >
                                                                                <MenuItem value="">
                                                                                    <em>Select Status</em>
                                                                                </MenuItem>
                                                                                {statusOptions.map((option) => (
                                                                                    <MenuItem key={option} value={option}>
                                                                                        {option}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <TextField
                                                                            value={subtask.text}
                                                                            onChange={(event) =>
                                                                                handleSubtaskTextChange(
                                                                                    event,
                                                                                    index,
                                                                                    subIndex
                                                                                )
                                                                            }
                                                                            fullWidth
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell />
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button startIcon={<AddIcon />} onClick={handleAddRow} sx={{ margin: 2 }}>
                Add New Ask
            </Button>
        </>
    );
};

export default Usertable;