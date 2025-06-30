"""
Path configuration for the application
Provides convenient imports similar to React's @ identifier
"""
import sys
from pathlib import Path

# プロジェクトルートディレクトリを取得
PROJECT_ROOT = Path(__file__).parent
SRC_DIR = PROJECT_ROOT / "src"

# sys.pathにsrcディレクトリを追加
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

# パスエイリアス（Reactの@識別子風）
class Paths:
    """Path aliases for convenient imports"""
    
    # @schemas - schemas directory
    SCHEMAS = SRC_DIR / "schemas"
    
    # @database - database related
    DATABASE = SRC_DIR / "schemas" / "database"
    
    # @api - API schemas
    API_SCHEMAS = SRC_DIR / "schemas" / "api"
    
    # @routers - routers directory
    ROUTERS = PROJECT_ROOT / "routers"
    
    # @utils - utilities (if exists)
    UTILS = SRC_DIR / "utils"

# Easy import function
def get_schema_module(module_name: str):
    """Get schema module by name"""
    import importlib
    return importlib.import_module(f"schemas.{module_name}")

def get_api_schema_module(module_name: str):
    """Get API schema module by name"""
    import importlib
    return importlib.import_module(f"schemas.api.{module_name}")
