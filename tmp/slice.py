import sys

def remove_lines(filepath, start_line, end_line):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    start_idx = start_line - 1
    end_idx = end_line
    
    new_lines = lines[:start_idx] + lines[end_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
if __name__ == '__main__':
    remove_lines(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]))
